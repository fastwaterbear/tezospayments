import { RequestPermissionInput, AbortedBeaconError } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Donation, Payment, Service, ServiceOperationType, Network, converters, memoize } from '@tezospayments/common';

import { config } from '../../config';
import { TezosPaymentsServiceContract } from '../../models/contracts';
import { NetworkDonation, NetworkPayment } from '../../models/payment';
import { PaymentInfo } from '../../models/payment/paymentInfo';
import { AppStore } from '../../store';
import { confirmPayment } from '../../store/currentPayment';
import { ServiceResult } from '../serviceResult';
import { errors, LocalPaymentServiceError } from './errors';
import { PaymentProvider, SerializedPaymentBase64Provider } from './paymentProviders';
import { BetterCallDevServiceProvider, ServiceProvider, TzKTServiceProvider, TzStatsServiceProvider } from './serviceProvider';
import { RawPaymentInfo, UrlRawPaymentInfoParser } from './urlRawPaymentInfoParser';
import { getBeaconNetworkType } from './utils';

interface LocalPaymentServiceOptions {
  readonly store: AppStore;
  readonly network: Network;
  readonly tezosToolkit: TezosToolkit;
  readonly tezosWallet: BeaconWallet;
}

export class LocalPaymentService {
  protected readonly network: Network;
  protected readonly store: AppStore;
  protected readonly tezosToolkit: TezosToolkit;
  protected readonly tezosWallet: BeaconWallet;
  protected readonly serviceProvider: ServiceProvider;
  protected readonly urlRawPaymentInfoParser = new UrlRawPaymentInfoParser();
  protected readonly paymentProviders: readonly PaymentProvider[] = [
    new SerializedPaymentBase64Provider()
  ];

  constructor(options: LocalPaymentServiceOptions) {
    this.network = options.network;
    this.store = options.store;
    this.tezosToolkit = options.tezosToolkit;
    this.tezosWallet = options.tezosWallet;

    this.serviceProvider = this.createServiceProvider(this.network);
  }

  async getCurrentPaymentInfo(): Promise<ServiceResult<PaymentInfo, LocalPaymentServiceError>> {
    const paymentResult = await this.getCurrentPayment();
    if (paymentResult.isServiceError)
      return paymentResult;

    const serviceResult = await this.getCurrentService();
    if (serviceResult.isServiceError)
      return serviceResult;

    return {
      payment: paymentResult,
      service: serviceResult
    };
  }

  async getCurrentPayment(): Promise<ServiceResult<Payment | Donation, LocalPaymentServiceError>> {
    const currentRawPaymentInfoResult = this.parseRawPaymentInfo(window.location);
    if (currentRawPaymentInfoResult.isServiceError)
      return currentRawPaymentInfoResult;

    const paymentProviderResult = this.getPaymentProvider(currentRawPaymentInfoResult);
    if (paymentProviderResult.isServiceError)
      return paymentProviderResult;

    return currentRawPaymentInfoResult.operationType === 'payment'
      ? paymentProviderResult.getPayment(currentRawPaymentInfoResult)
      : paymentProviderResult.getDonation(currentRawPaymentInfoResult);
  }

  async getCurrentService(): Promise<ServiceResult<Service, LocalPaymentServiceError>> {
    const currentRawPaymentInfoResult = this.parseRawPaymentInfo(window.location);
    if (currentRawPaymentInfoResult.isServiceError)
      return currentRawPaymentInfoResult;

    return this.serviceProvider.getService(currentRawPaymentInfoResult.targetAddress);
  }

  async pay(payment: NetworkPayment): Promise<ServiceResult<boolean>> {
    return (Payment.publicDataExists(payment.data))
      ? this.sendPayment(
        ServiceOperationType.Payment,
        payment.targetAddress,
        payment.amount,
        payment.asset,
        converters.objectToBytes(payment.data.public)
      )
      : { isServiceError: true, error: errors.invalidPayment };
  }

  async donate(donation: NetworkDonation): Promise<ServiceResult<boolean>> {
    return this.sendPayment(
      ServiceOperationType.Donation,
      donation.targetAddress,
      donation.amount,
      donation.asset,
      ''
    );
  }

  protected parseRawPaymentInfo = memoize(
    (url: URL | Location): ServiceResult<RawPaymentInfo, LocalPaymentServiceError> => {
      const parserResult = this.urlRawPaymentInfoParser.parse(url);

      return typeof parserResult !== 'string'
        ? parserResult
        : { isServiceError: true, error: parserResult };
    }
  );

  protected async sendPayment(
    serviceOperationType: ServiceOperationType,
    targetAddress: string,
    amount: BigNumber,
    assetTokenAddress: string | undefined,
    payload: string
  ): Promise<ServiceResult<boolean>> {
    try {
      await this.tezosWallet.client.clearActiveAccount();
      const canceled = await this.requestPermissions({ network: { type: getBeaconNetworkType(this.network) } });
      if (canceled)
        return false;

      const contract: TezosPaymentsServiceContract<Wallet> = await this.tezosToolkit.wallet.at(targetAddress);
      if (!contract.methods.send_payment)
        return { isServiceError: true, error: errors.invalidContract };

      let result;
      if (assetTokenAddress) {
        result = await contract.methods.send_payment(
          assetTokenAddress,
          amount,
          serviceOperationType,
          'public',
          payload,
        ).send();
      } else {
        result = await contract.methods.send_payment(
          assetTokenAddress as void,
          serviceOperationType,
          'public',
          payload,
        ).send({ amount });
      }

      await this.waitConfirmation(result);

      return true;
    }
    catch (error: unknown) {
      return (error instanceof AbortedBeaconError) ? false : { isServiceError: true, error: (error as Error).message };
    }
  }

  protected requestPermissions(request?: RequestPermissionInput) {
    const beaconAlertWrapperObserver = this.getBeaconAlertWrapperObserver();

    return Promise.race(
      [
        this.tezosWallet.requestPermissions(request),
        beaconAlertWrapperObserver.observe()
      ])
      .finally(() => {
        beaconAlertWrapperObserver.finalize();
      });
  }

  protected getPaymentProvider(rawPaymentInfo: RawPaymentInfo): ServiceResult<PaymentProvider, LocalPaymentServiceError> {
    return this.paymentProviders.find(paymentProvider => paymentProvider.isMatch(rawPaymentInfo))
      || { isServiceError: true, error: rawPaymentInfo.operationType === 'payment' ? errors.invalidPayment : errors.invalidDonation };
  }

  private createServiceProvider(network: Network): ServiceProvider {
    const networkConfig = config.tezos.networks[network.name];
    const indexerName = networkConfig.default.indexer;

    if (indexerName === 'betterCallDev')
      return new BetterCallDevServiceProvider(network, networkConfig.indexerUrls.betterCallDev);
    else if (indexerName === 'tzKT')
      return new TzKTServiceProvider(network, networkConfig.indexerUrls.tzKT);
    else if (indexerName === 'tzStats')
      return new TzStatsServiceProvider(network, networkConfig.indexerUrls.tzStats);
    else
      throw new Error('Unknown service provider');
  }

  private waitConfirmation(operation: TransactionWalletOperation, confirmations?: number) {
    // TODO: use a service event instead of dispatching
    this.store.dispatch(confirmPayment({
      hash: operation.opHash,
      blockHash: undefined,
      confirmationCount: 0
    }));

    return new Promise<void>((resolve, reject) => {
      operation.confirmationObservable(confirmations)
        .subscribe(
          // TODO: use a service event instead of dispatching
          confirmation => this.store.dispatch(confirmPayment({
            hash: operation.opHash,
            blockHash: confirmation.block.hash,
            confirmationCount: confirmation.currentConfirmation
          })),
          reject,
          resolve
        );
    });
  }

  private getBeaconAlertWrapperObserver() {
    let beaconAlertWrapperObserverIntervalId: ReturnType<typeof setInterval> | undefined;
    let beaconAlertWrapperShadowRoot: ShadowRoot | null | undefined;
    let alertModalElement: Element | null | undefined;
    let closeButtonElement: Element | null | undefined;
    let onBeaconAlertWrapperClosedHandler: ((event: Event) => void) | undefined;

    return {
      observe: () => new Promise<boolean>(resolve => {
        beaconAlertWrapperObserverIntervalId = setInterval(() => {
          beaconAlertWrapperShadowRoot = document.querySelector('[id^="beacon-alert-wrapper"]')?.shadowRoot;
          if (!beaconAlertWrapperShadowRoot)
            return;

          if (beaconAlertWrapperObserverIntervalId !== undefined) {
            clearInterval(beaconAlertWrapperObserverIntervalId);
            beaconAlertWrapperObserverIntervalId = undefined;
          }

          alertModalElement = beaconAlertWrapperShadowRoot.querySelector('[id^="beacon-alert-modal"]');
          closeButtonElement = beaconAlertWrapperShadowRoot.querySelector('.beacon-modal__close__wrapper');

          onBeaconAlertWrapperClosedHandler = (event: Event) => {
            if (event instanceof KeyboardEvent && event.key !== 'Escape')
              return;

            resolve(true);
          };

          window.addEventListener('keydown', onBeaconAlertWrapperClosedHandler);
          alertModalElement?.addEventListener('click', onBeaconAlertWrapperClosedHandler);
          closeButtonElement?.addEventListener('click', onBeaconAlertWrapperClosedHandler);
        }, 100);
      }),
      finalize: () => {
        beaconAlertWrapperObserverIntervalId && clearInterval(beaconAlertWrapperObserverIntervalId);

        if (onBeaconAlertWrapperClosedHandler) {
          window.removeEventListener('keydown', onBeaconAlertWrapperClosedHandler);
          alertModalElement?.removeEventListener('click', onBeaconAlertWrapperClosedHandler);
          closeButtonElement?.removeEventListener('click', onBeaconAlertWrapperClosedHandler);
        }
      }
    } as const;
  }
}
