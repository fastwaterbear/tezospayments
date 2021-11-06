import { RequestPermissionInput, AbortedBeaconError } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation, Wallet } from '@taquito/taquito';
import { BatchWalletOperation } from '@taquito/taquito/dist/types/wallet/batch-operation';
import BigNumber from 'bignumber.js';

import {
  Donation, Payment, Service, ServiceOperationType, Network,
  converters as commonConverters, memoize, tokenWhitelistMap, TokenFA2, TokenFA12
} from '@tezospayments/common';
import { converters, Fa12Contract, Fa20Contract, ServicesProvider, TezosPaymentsServiceContract } from '@tezospayments/react-web-core';

import { NetworkDonation, NetworkPayment } from '../../models/payment';
import { PaymentInfo } from '../../models/payment/paymentInfo';
import { AppStore } from '../../store';
import { confirmPayment } from '../../store/currentPayment';
import { errors } from './errors';
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

  async getCurrentPaymentInfo(): Promise<PaymentInfo> {
    const payment = await this.getCurrentPayment();
    const service = await this.getCurrentService();

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

  async getCurrentService(): Promise<Service> {
    const currentRawPaymentInfo = this.parseRawPaymentInfo(window.location);

    return this.servicesProvider.getService(currentRawPaymentInfo.targetAddress);
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
    (url: URL | Location): RawPaymentInfo => {
      const parserResult = this.urlRawPaymentInfoParser.parse(url);

      if (typeof parserResult === 'string')
        throw new Error(parserResult);

      return parserResult;
    }
  );

  protected async sendPayment(
    serviceOperationType: ServiceOperationType,
    targetAddress: string,
    amount: BigNumber,
    assetTokenAddress: string | undefined,
    payload: string
  ): Promise<boolean> {
    try {
      await this.tezosWallet.client.clearActiveAccount();
      const canceled = await this.requestPermissions({ network: { type: converters.networkToBeaconNetwork(this.network) } });
      if (canceled)
        return false;

      const contract = await this.tezosToolkit.wallet.at<TezosPaymentsServiceContract<Wallet>>(targetAddress);
      let operation;

      if (!assetTokenAddress) {
        operation = await this.sendNativeToken(contract, serviceOperationType, amount, payload);
      } else {
        const token = tokenWhitelistMap.get(this.network)?.get(assetTokenAddress);
        if (!token || !token.metadata)
          return false;

        const tokenAmount = amount.multipliedBy(10 ** token.metadata.decimals);

        operation = token.type === 'fa1.2'
          ? await this.sendFa12Token(contract, token, serviceOperationType, tokenAmount, payload)
          : await this.sendFa20Token(contract, token, serviceOperationType, tokenAmount, payload);
      }

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

  private async sendNativeToken(
    contract: TezosPaymentsServiceContract<Wallet>,
    serviceOperationType: ServiceOperationType,
    amount: BigNumber,
    payload: string
  ): Promise<TransactionWalletOperation> {
    return await contract.methods.send_payment(
      undefined,
      serviceOperationType,
      'public',
      payload,
    ).send({ amount });
  }

  private async sendFa12Token(
    contract: TezosPaymentsServiceContract<Wallet>,
    token: TokenFA12,
    serviceOperationType: ServiceOperationType,
    amount: BigNumber,
    payload: string
  ): Promise<BatchWalletOperation> {
    const tokenContract = await this.tezosToolkit.wallet.at<Fa12Contract<Wallet>>(token.contractAddress);

    return await this.tezosToolkit.wallet.batch()
      .withContractCall(tokenContract.methods.approve(contract.address, amount))
      .withContractCall(
        contract.methods.send_payment(
          token.contractAddress,
          null,
          amount,
          serviceOperationType,
          'public',
          payload,
        )
      ).send();
  }

  private async sendFa20Token(
    contract: TezosPaymentsServiceContract<Wallet>,
    token: TokenFA2,
    serviceOperationType: ServiceOperationType,
    amount: BigNumber,
    payload: string
  ): Promise<BatchWalletOperation> {
    const tokenContract = await this.tezosToolkit.wallet.at<Fa20Contract<Wallet>>(token.contractAddress);
    const userAddress = await this.tezosToolkit.wallet.pkh();

    return await this.tezosToolkit.wallet.batch()
      .withContractCall(tokenContract.methods.update_operators([{
        add_operator: {
          owner: userAddress,
          operator: contract.address,
          token_id: token.fa2TokenId
        }
      }]))
      .withContractCall(
        contract.methods.send_payment(
          token.contractAddress,
          token.fa2TokenId,
          amount,
          serviceOperationType,
          'public',
          payload,
        )
      )
      .withContractCall(tokenContract.methods.update_operators([{
        remove_operator: {
          owner: userAddress,
          operator: contract.address,
          token_id: token.fa2TokenId
        }
      }]))
      .send();
  }

  private waitConfirmation(operation: TransactionWalletOperation | BatchWalletOperation, confirmations?: number) {
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
