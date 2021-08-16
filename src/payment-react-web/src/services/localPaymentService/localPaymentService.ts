import { ColorMode, RequestPermissionInput, AbortedBeaconError } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Network, networks } from '@tezospayments/common/dist/models/blockchain';
import { Donation, Payment, PaymentType } from '@tezospayments/common/dist/models/payment';
import { PaymentBase } from '@tezospayments/common/dist/models/payment/paymentBase';
import { Service, ServiceOperationType } from '@tezospayments/common/dist/models/service';
import { converters, memoize } from '@tezospayments/common/dist/utils';

import { config } from '../../config';
import { TezosPaymentsServiceContract } from '../../models/contracts';
import { NetworkDonation, NetworkPayment } from '../../models/payment';
import { PaymentInfo } from '../../models/payment/paymentInfo';
import { AppStore } from '../../store';
import { confirmPayment } from '../../store/currentPayment';
import { ServiceResult } from '../serviceResult';
import { errors, LocalPaymentServiceError } from './errors';
import { ServiceProvider, TzKTServiceProvider } from './serviceProvider';
import { RawPaymentInfo, UrlRawPaymentInfoParser } from './urlRawPaymentInfoParser';
import { getBeaconNetworkType } from './utils';

export class LocalPaymentService {
  readonly urlRawPaymentInfoParser = new UrlRawPaymentInfoParser();
  readonly tezosToolkit = new TezosToolkit(
    config.tezos.networks[config.tezos.defaultNetwork].rpcUrls[config.tezos.networks[config.tezos.defaultNetwork].default.rpc]
  );
  readonly tezosWallet = new BeaconWallet({ name: config.app.name, colorMode: ColorMode.LIGHT });
  readonly serviceProvider: ServiceProvider = new TzKTServiceProvider(networks.edo2net);

  constructor(readonly store: AppStore) {
    this.tezosToolkit.setWalletProvider(this.tezosWallet);
  }

  async getCurrentPaymentInfo(): Promise<ServiceResult<PaymentInfo, LocalPaymentServiceError>> {
    const paymentResult = this.getCurrentPayment();
    if (paymentResult.isServiceError)
      return paymentResult;

    const serviceResult = await this.getCurrentService();
    if (serviceResult.isServiceError)
      return serviceResult;

    const networkResult = this.getCurrentNetwork();
    if (networkResult.isServiceError)
      return networkResult;

    return {
      payment: paymentResult,
      service: serviceResult,
      network: networkResult
    };
  }

  getCurrentPayment(): ServiceResult<Payment | Donation, LocalPaymentServiceError> {
    const currentRawPaymentInfoResult = this.parseRawPaymentInfo(window.location);
    if (currentRawPaymentInfoResult.isServiceError)
      return currentRawPaymentInfoResult;

    return currentRawPaymentInfoResult.operationType === 'payment'
      ? this.parsePayment(currentRawPaymentInfoResult.serializedPayment, currentRawPaymentInfoResult.targetAddress, [])
      : this.parseDonation(currentRawPaymentInfoResult.serializedPayment || '', currentRawPaymentInfoResult.targetAddress, []);
  }

  async getCurrentService(): Promise<ServiceResult<Service, LocalPaymentServiceError>> {
    const currentRawPaymentInfoResult = this.parseRawPaymentInfo(window.location);
    if (currentRawPaymentInfoResult.isServiceError)
      return currentRawPaymentInfoResult;

    return this.serviceProvider.getService(currentRawPaymentInfoResult.targetAddress);
  }

  getCurrentNetwork(): ServiceResult<Network, LocalPaymentServiceError> {
    const currentRawPaymentInfoResult = this.parseRawPaymentInfo(window.location);
    if (currentRawPaymentInfoResult.isServiceError)
      return currentRawPaymentInfoResult;

    let network: Network | undefined;
    if (currentRawPaymentInfoResult.networkName) {
      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      const isSupportedNetwork: boolean = !!config.tezos.networks[currentRawPaymentInfoResult.networkName as keyof typeof config.tezos.networks];
      network = isSupportedNetwork && currentRawPaymentInfoResult.networkName
        ? networks[currentRawPaymentInfoResult.networkName as keyof typeof networks]
        : undefined;
    }

    return network || networks[config.tezos.defaultNetwork];
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
      const currentNetworkResult = this.getCurrentNetwork();
      if (currentNetworkResult.isServiceError)
        return currentNetworkResult;

      await this.tezosWallet.client.clearActiveAccount();
      const canceled = await this.requestPermissions({ network: { type: getBeaconNetworkType(currentNetworkResult) } });
      if (canceled)
        return false;

      const contract: TezosPaymentsServiceContract<Wallet> = await this.tezosToolkit.wallet.at(targetAddress);
      if (!contract.methods.send_payment)
        return { isServiceError: true, error: errors.invalidContract };

      const result = await contract.methods.send_payment(
        assetTokenAddress as void,
        serviceOperationType,
        'public',
        payload,
      )
        .send({ amount });

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

  private parsePayment(paymentBase64: string, targetAddress: string, urls: PaymentBase['urls']): ServiceResult<Payment, LocalPaymentServiceError> {
    const payment = Payment.parse(paymentBase64, {
      type: PaymentType.Payment,
      targetAddress,
      urls
    });

    return payment && Payment.validate(payment) === undefined
      ? payment
      : { isServiceError: true, error: errors.invalidPayment };
  }

  private parseDonation(donationBase64: string, targetAddress: string, urls: PaymentBase['urls']): ServiceResult<Donation, LocalPaymentServiceError> {
    const donation = Donation.parse(donationBase64, {
      type: PaymentType.Donation,
      targetAddress,
      urls
    });

    return donation && Donation.validate(donation) === undefined
      ? donation
      : { isServiceError: true, error: errors.invalidDonation };
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
