import { ColorMode, NetworkType, RequestPermissionInput, AbortedBeaconError } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation, Wallet } from '@taquito/taquito';

import { networks } from '@tezospayments/common/dist/models/blockchain';
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
import { BetterCallDevServiceProvider, ServiceProvider } from './serviceProvider';

type Segments = readonly [
  targetAddress: string,
  operationType: string
];

export class LocalPaymentService {
  readonly tezosToolkit = new TezosToolkit(config.tezos.rpcNodes.edo2net[0]);
  readonly tezosWallet = new BeaconWallet({ name: config.app.name, colorMode: ColorMode.LIGHT });
  readonly serviceProvider: ServiceProvider = new BetterCallDevServiceProvider(networks.edo2net);

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

    return {
      payment: paymentResult,
      service: serviceResult,
    };
  }

  getCurrentPayment(): ServiceResult<Payment | Donation, LocalPaymentServiceError> {
    const currentLocation = window.location;

    const segmentsResult = this.getSegments(currentLocation.pathname);
    if (segmentsResult.isServiceError)
      return segmentsResult;

    const isPaymentType = segmentsResult[1] === 'payment';

    const paymentOrDonationBase64 = currentLocation.hash.slice(1);
    if (!paymentOrDonationBase64 && isPaymentType)
      return { isServiceError: true, error: errors.invalidUrl };

    const targetAddress = segmentsResult[0];
    const urls = [{ type: 'base64', url: new URL(window.location.href) }] as const;

    return isPaymentType
      ? this.parsePayment(paymentOrDonationBase64, targetAddress, urls)
      : this.parseDonation(paymentOrDonationBase64, targetAddress, urls);
  }

  async getCurrentService(): Promise<ServiceResult<Service, LocalPaymentServiceError>> {
    const currentLocation = window.location;
    const segmentsResult = this.getSegments(currentLocation.pathname);
    if (segmentsResult.isServiceError)
      return segmentsResult;

    return this.serviceProvider.getService(segmentsResult[0]);
  }

  async pay(payment: NetworkPayment): Promise<ServiceResult<boolean>> {
    try {
      if (!Payment.publicDataExists(payment.data))
        return { isServiceError: true, error: errors.invalidPayment };

      await this.tezosWallet.client.clearActiveAccount();
      const canceled = await this.requestPermissions({ network: { type: NetworkType.EDONET } });
      if (canceled)
        return false;

      const contract: TezosPaymentsServiceContract<Wallet> = await this.tezosToolkit.wallet.at(payment.targetAddress);
      if (!contract.methods.send_payment)
        return { isServiceError: true, error: errors.invalidContract };

      const result = await contract.methods.send_payment(
        undefined,
        ServiceOperationType.Payment,
        'public',
        converters.objectToBytes(payment.data.public),
      )
        .send({
          amount: payment.amount
        });

      await this.waitConfirmation(result);

      return true;
    }
    catch (error: unknown) {
      return (error instanceof AbortedBeaconError) ? false : { isServiceError: true, error: (error as Error).message };
    }
  }

  async donate(_donation: NetworkDonation): Promise<ServiceResult<boolean>> {
    try {
      // TODO

      return true;
    }
    catch (error: unknown) {
      return (error instanceof AbortedBeaconError) ? false : { isServiceError: true, error: (error as Error).message };
    }
  }

  protected requestPermissions(request?: RequestPermissionInput) {
    let popupObserver: MutationObserver | undefined;

    return Promise.race(
      [
        this.tezosWallet.requestPermissions(request),
        new Promise<boolean>(resolve => {
          popupObserver = this.getBeaconAlertWrapperObserver(closedByUser => {
            if (closedByUser)
              resolve(true);
            else
              popupObserver?.disconnect();
          });
          popupObserver.observe(document.body, { childList: true });
        })
      ])
      .finally(() => {
        popupObserver?.disconnect();
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
      type: PaymentType.Donation
      ,
      targetAddress,
      urls
    });

    return donation && Donation.validate(donation) === undefined
      ? donation
      : { isServiceError: true, error: errors.invalidDonation };
  }

  private getSegments = memoize((pathname: string): ServiceResult<Segments, LocalPaymentServiceError> => {
    const segments = pathname.split('/').filter(Boolean) as readonly string[] as Segments;

    if (segments.length !== 2 || (segments[1] !== 'payment' && segments[1] !== 'donation'))
      return { isServiceError: true, error: errors.invalidUrl };

    return segments;
  });

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

  private getBeaconAlertWrapperObserver(onBeaconAlertWrapperClosed: (closedByUser: boolean) => void) {
    return new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode instanceof Element && addedNode.getAttribute('id') === 'beacon-toast-wrapper') {
            onBeaconAlertWrapperClosed(false);
            return;
          }
        }

        for (const removedNode of mutation.removedNodes) {
          if (removedNode instanceof Element && removedNode.shadowRoot
            && removedNode.shadowRoot.querySelector('[id^="beacon-alert-modal"]')) {
            onBeaconAlertWrapperClosed(true);
            return;
          }
        }
      }
    });
  }
}
