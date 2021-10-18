import { RequestPermissionInput } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {
  Donation, Payment, Service, ServiceOperationType, Network,
  converters as commonConverters, memoize
} from '@tezospayments/common';
import { converters, ServicesProvider, TezosPaymentsServiceContract } from '@tezospayments/react-web-core';

import { NetworkDonation, NetworkPayment } from '../../models/payment';
import { PaymentInfo } from '../../models/payment/paymentInfo';
import { AppStore } from '../../store';
import { confirmPayment } from '../../store/currentPayment';
import { ServiceResult } from '../serviceResult';
import { errors, LocalPaymentServiceError } from './errors';
import { PaymentProvider, SerializedPaymentBase64Provider } from './paymentProviders';
import { RawPaymentInfo, UrlRawPaymentInfoParser } from './urlRawPaymentInfoParser';

interface LocalPaymentServiceOptions {
  readonly store: AppStore;
  readonly network: Network;
  readonly tezosToolkit: TezosToolkit;
  readonly tezosWallet: BeaconWallet;
  readonly servicesProvider: ServicesProvider;
}

export class LocalPaymentService {
  protected readonly network: Network;
  protected readonly store: AppStore;
  protected readonly tezosToolkit: TezosToolkit;
  protected readonly tezosWallet: BeaconWallet;
  protected readonly servicesProvider: ServicesProvider;
  protected readonly urlRawPaymentInfoParser = new UrlRawPaymentInfoParser();
  protected readonly paymentProviders: readonly PaymentProvider[] = [
    new SerializedPaymentBase64Provider()
  ];

  constructor(options: LocalPaymentServiceOptions) {
    this.network = options.network;
    this.store = options.store;
    this.tezosToolkit = options.tezosToolkit;
    this.tezosWallet = options.tezosWallet;
    this.servicesProvider = options.servicesProvider;
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

    return this.servicesProvider.getService(currentRawPaymentInfoResult.targetAddress);
  }

  async pay(payment: NetworkPayment): Promise<boolean> {
    if (!Payment.publicDataExists(payment.data)) {
      throw new Error(errors.invalidPayment);
    }

    return this.sendPayment(
      ServiceOperationType.Payment,
      payment.targetAddress,
      payment.amount,
      payment.asset,
      commonConverters.objectToBytes(payment.data.public)
    );
  }

  async donate(donation: NetworkDonation): Promise<boolean> {
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
  ): Promise<boolean> {
    await this.tezosWallet.client.clearActiveAccount();
    const canceled = await this.requestPermissions({ network: { type: converters.networkToBeaconNetwork(this.network) } });
    if (canceled)
      return false;

    const contract = await this.tezosToolkit.wallet.at<TezosPaymentsServiceContract<Wallet>>(targetAddress);

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
