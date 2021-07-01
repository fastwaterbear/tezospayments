import { ColorMode, NetworkType, RequestPermissionInput, AbortedBeaconError } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation, Wallet } from '@taquito/taquito';

import { networks } from '@tezos-payments/common/dist/models/blockchain';
import { Payment } from '@tezos-payments/common/dist/models/payment';
import { Service, ServiceOperationType } from '@tezos-payments/common/dist/models/service';
import { converters, memoize } from '@tezos-payments/common/dist/utils';

import { config } from '../../config';
import { TezosPaymentsServiceContract } from '../../models/contracts';
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

  getCurrentPayment(): ServiceResult<Payment, LocalPaymentServiceError> {
    const currentLocation = window.location;

    const paymentBase64 = currentLocation.hash.slice(1);
    if (!paymentBase64)
      return { isServiceError: true, error: errors.invalidUrl };

    const segmentsResult = this.getSegments(currentLocation.pathname);
    if (segmentsResult.isServiceError)
      return segmentsResult;

    const payment = Payment.parse(paymentBase64, {
      targetAddress: segmentsResult[0],
      urls: [{ type: 'base64', url: new URL(window.location.href) }]
    });

    return payment && Payment.validate(payment)
      ? payment
      : { isServiceError: true, error: errors.invalidPayment };
  }

  async getCurrentService(): Promise<ServiceResult<Service, LocalPaymentServiceError>> {
    const currentLocation = window.location;
    const segmentsResult = this.getSegments(currentLocation.pathname);
    if (segmentsResult.isServiceError)
      return segmentsResult;

    return this.serviceProvider.getService(segmentsResult[0]);
  }

  async pay(payment: Payment): Promise<ServiceResult<boolean>> {
    try {
      if (!Payment.publicDataExists(payment))
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
      if (error instanceof AbortedBeaconError)
        return false;

      return { isServiceError: true, error: (error as Error).message };
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

  private getSegments = memoize((pathname: string): ServiceResult<Segments, LocalPaymentServiceError> => {
    const segments = pathname.split('/').filter(Boolean) as readonly string[] as Segments;

    if (segments.length !== 2)
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
