import { RequestPermissionInput, AbortedBeaconError } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, WalletOperation } from '@taquito/taquito';

import { Donation, Payment, Network, memoize } from '@tezospayments/common';
import { converters, ServicesProvider } from '@tezospayments/react-web-core';

import { NetworkDonation, NetworkPayment } from '../../models/payment';
import { PaymentInfo } from '../../models/payment/paymentInfo';
import { AppStore } from '../../store';
import { confirmPayment } from '../../store/currentPayment';
import { errors } from './errors';
import { PaymentProvider, SerializedPaymentBase64Provider } from './paymentProviders';
import { DonationSender, PaymentSender } from './sender';
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
  protected readonly paymentSender;
  protected readonly donationSender;

  constructor(options: LocalPaymentServiceOptions) {
    this.network = options.network;
    this.store = options.store;
    this.tezosToolkit = options.tezosToolkit;
    this.tezosWallet = options.tezosWallet;
    this.servicesProvider = options.servicesProvider;

    this.paymentSender = new PaymentSender(this.network, this.tezosToolkit, this.tezosWallet);
    this.donationSender = new DonationSender(this.network, this.tezosToolkit, this.tezosWallet);
  }

  async getCurrentPaymentInfo(): Promise<PaymentInfo> {
    const payment = await this.getCurrentPayment();
    const service = await this.servicesProvider.getService(payment.targetAddress);

    return {
      payment,
      service
    };
  }

  async getCurrentPayment(): Promise<Payment | Donation> {
    const currentRawPaymentInfo = this.parseRawPaymentInfo(window.location);
    const paymentProvider = this.getPaymentProvider(currentRawPaymentInfo);

    return currentRawPaymentInfo.operationType === 'payment'
      ? paymentProvider.getPayment(currentRawPaymentInfo)
      : paymentProvider.getDonation(currentRawPaymentInfo);
  }

  async pay(payment: NetworkPayment): Promise<boolean> {
    return this.send(() => this.paymentSender.send(payment));
  }

  async donate(donation: NetworkDonation): Promise<boolean> {
    return this.send(() => this.donationSender.send(donation));
  }

  protected parseRawPaymentInfo = memoize(
    (url: URL | Location): RawPaymentInfo => {
      const parserResult = this.urlRawPaymentInfoParser.parse(url);

      if (typeof parserResult === 'string')
        throw new Error(parserResult);

      return parserResult;
    }
  );

  protected async send(getSendOperation: () => Promise<WalletOperation>): Promise<boolean> {
    try {
      await this.tezosWallet.client.clearActiveAccount();
      const canceled = await this.requestPermissions({ network: { type: converters.networkToBeaconNetwork(this.network) } });
      if (canceled)
        return false;

      const operation = await getSendOperation();

      await this.waitConfirmation(operation);

      return true;
    } catch (error: unknown) {
      if (error instanceof AbortedBeaconError)
        return false;

      throw error;
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

  protected getPaymentProvider(rawPaymentInfo: RawPaymentInfo): PaymentProvider {
    const paymentProvider = this.paymentProviders.find(paymentProvider => paymentProvider.isMatch(rawPaymentInfo));
    if (!paymentProvider)
      throw new Error(rawPaymentInfo.operationType === 'payment' ? errors.invalidPayment : errors.invalidDonation);

    return paymentProvider;
  }

  private waitConfirmation(operation: WalletOperation, confirmations?: number) {
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
