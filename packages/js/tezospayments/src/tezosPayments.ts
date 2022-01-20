import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';

import {
  native, networks, PaymentUrlType, DeepReadonly, FailedValidationResults,
  UnsignedPayment as CommonUnsignedPaymentModel, Payment as CommonPaymentModel,
  PaymentType, PaymentValidator, Mutable, Network, CustomNetwork
} from '@tezospayments/common';

import { InvalidPaymentCreateParametersError, InvalidPaymentError, InvalidTezosPaymentsOptionsError, UnsupportedPaymentUrlTypeError } from './errors';
import { Payment } from './models';
import type { DefaultPaymentParameters, PaymentCreateParameters, TezosPaymentsOptions } from './options';
import { Base64PaymentUrlFactory, PaymentUrlFactory } from './paymentUrlFactories';
import { ApiSecretKeySigner, CustomSigner, TezosPaymentsSigner, WalletSigner } from './signers';
import { TezosPaymentsOptionsValidator } from './validation';

export class TezosPayments {
  static readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters> = {
    urlType: PaymentUrlType.Base64
  };

  protected readonly optionsValidator = new TezosPaymentsOptionsValidator();
  protected readonly paymentValidator = new PaymentValidator();
  protected readonly serviceContractAddress: string;
  protected readonly signer: TezosPaymentsSigner;
  protected readonly network: Network | CustomNetwork;
  protected readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters>;

  private paymentUrlFactories: Map<PaymentUrlType, PaymentUrlFactory> = new Map();

  constructor(options: DeepReadonly<TezosPaymentsOptions>) {
    const errors = this.optionsValidator.validateOptions(options);
    if (errors)
      throw new InvalidTezosPaymentsOptionsError(errors);

    this.serviceContractAddress = options.serviceContractAddress;
    this.network = options.network || networks.mainnet;
    this.defaultPaymentParameters = options.defaultPaymentParameters
      ? {
        urlType: options.defaultPaymentParameters.urlType || TezosPayments.defaultPaymentParameters.urlType
      }
      : TezosPayments.defaultPaymentParameters;

    this.signer = this.createSigner(options.signing);
    this.getPaymentUrlFactory(this.defaultPaymentParameters.urlType);
  }

  async createPayment(createParameters: PaymentCreateParameters): Promise<Payment> {
    if (!createParameters)
      throw new InvalidPaymentCreateParametersError(createParameters);

    let errors: FailedValidationResults;
    if (createParameters.urlType) {
      errors = this.optionsValidator.validateDefaultPaymentParameters(createParameters);
      if (errors)
        throw new InvalidPaymentError(errors);
    }

    const unsignedPayment = this.createPaymentByCreateParameters(createParameters);
    errors = this.paymentValidator.validate(unsignedPayment, true);
    if (errors)
      throw new InvalidPaymentError(errors);

    const signedPayment = await this.getSignedPayment(unsignedPayment);
    errors = this.paymentValidator.validate(signedPayment, true);
    if (errors)
      throw new InvalidPaymentError(errors);

    const paymentUrl = await this.getPaymentUrl(signedPayment, createParameters.urlType);
    const payment = this.applyPaymentUrl(signedPayment, paymentUrl);

    return payment;
  }

  protected getPaymentUrl(payment: CommonPaymentModel, urlType = this.defaultPaymentParameters.urlType): string | Promise<string> {
    return this.getPaymentUrlFactory(urlType).createPaymentUrl(payment, this.network);
  }

  protected applyPaymentUrl(payment: CommonPaymentModel, url: string): Payment {
    (payment as Mutable<Payment>).url = url;

    return (payment as Payment);
  }

  protected getPaymentUrlFactory(paymentUrlType: PaymentUrlType): PaymentUrlFactory {
    let paymentUrlFactory = this.paymentUrlFactories.get(paymentUrlType);
    if (!paymentUrlFactory) {
      paymentUrlFactory = this.createPaymentUrlFactory(paymentUrlType);
      this.paymentUrlFactories.set(paymentUrlType, paymentUrlFactory);
    }

    return paymentUrlFactory;
  }

  protected async getSignedPayment(unsignedPayment: CommonUnsignedPaymentModel): Promise<CommonPaymentModel> {
    (unsignedPayment as Mutable<CommonPaymentModel>).signature = await this.signer.sign(unsignedPayment);

    return unsignedPayment as CommonPaymentModel;
  }

  protected createSigner(signingOptions: TezosPaymentsOptions['signing']): TezosPaymentsSigner {
    if ('apiSecretKey' in signingOptions)
      return new ApiSecretKeySigner(signingOptions.apiSecretKey);
    if ('wallet' in signingOptions)
      return new WalletSigner(signingOptions.wallet.signingPublicKey, signingOptions.wallet.sign);

    return new CustomSigner(signingOptions.custom);
  }

  protected createPaymentUrlFactory(paymentUrlType: PaymentUrlType): PaymentUrlFactory {
    switch (paymentUrlType) {
      case PaymentUrlType.Base64:
        return new Base64PaymentUrlFactory();
      default:
        throw new UnsupportedPaymentUrlTypeError(`This payment url type is not supported: ${paymentUrlType}`);
    }
  }

  protected createPaymentByCreateParameters(createParameters: PaymentCreateParameters): CommonUnsignedPaymentModel {
    // TODO: check decimals
    // TODO: floor amount to decimals count: new BigNumber(amount).toFixed(asset.decimals)
    const payment: Mutable<CommonUnsignedPaymentModel> = {
      type: PaymentType.Payment,
      id: createParameters.id || nanoid(),
      targetAddress: this.serviceContractAddress,
      amount: new BigNumber(createParameters.amount),
      data: createParameters.data,
      created: createParameters.created ? new Date(createParameters.created) : new Date(),
    };

    if (createParameters.asset)
      payment.asset = createParameters.asset;
    if (createParameters.expired)
      payment.expired = new Date(createParameters.expired);
    if (createParameters.successUrl)
      payment.successUrl = new native.URL(createParameters.successUrl);
    if (createParameters.cancelUrl)
      payment.cancelUrl = new native.URL(createParameters.cancelUrl);

    return payment;
  }
}
