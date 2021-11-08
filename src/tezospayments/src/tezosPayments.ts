import BigNumber from 'bignumber.js';
import { nanoid } from 'nanoid';

import {
  native, networks, tezosInfo, networkNameRegExp, networkIdRegExp, PaymentUrlType,
  DeepReadonly, FailedValidationResults, UnsignedPayment as CommonUnsignedPaymentModel, Payment as CommonPaymentModel,
  PaymentType, PaymentValidator, Mutable
} from '@tezospayments/common';

import { InvalidPaymentCreateParametersError, InvalidPaymentError, InvalidTezosPaymentsOptionsError, UnsupportedPaymentUrlTypeError } from './errors';
import { Payment } from './models';
import type { DefaultPaymentParameters, PaymentCreateParameters, TezosPaymentsOptions } from './options';
import { Base64PaymentUrlFactory, PaymentUrlFactory } from './paymentUrlFactories';
import { ApiSecretKeySigner, CustomSigner, TezosPaymentsSigner, WalletSigner } from './signers';
import { tezosPaymentsOptionsValidationErrors } from './validationErrors';

export class TezosPayments {
  static readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters> = {
    network: networks.granadanet,
    urlType: PaymentUrlType.Base64
  };
  protected static readonly optionsValidationErrors = tezosPaymentsOptionsValidationErrors;

  protected readonly paymentValidator: PaymentValidator = new PaymentValidator();
  protected readonly serviceContractAddress: string;
  protected readonly signer: TezosPaymentsSigner;
  protected readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters>;

  private paymentUrlFactories: Map<PaymentUrlType, PaymentUrlFactory> = new Map();

  constructor(options: DeepReadonly<TezosPaymentsOptions>) {
    const errors = this.validateOptions(options);
    if (errors)
      throw new InvalidTezosPaymentsOptionsError(errors);

    this.serviceContractAddress = options.serviceContractAddress;
    this.defaultPaymentParameters = options.defaultPaymentParameters
      ? {
        network: options.defaultPaymentParameters.network || TezosPayments.defaultPaymentParameters.network,
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
    if (createParameters.urlType || createParameters.network) {
      errors = this.validateDefaultPaymentParameters(createParameters);
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

    const paymentUrl = await this.getPaymentUrl(signedPayment, createParameters.urlType, createParameters.network);
    const payment = this.applyPaymentUrl(signedPayment, paymentUrl);

    return payment;
  }

  protected getPaymentUrl(
    payment: CommonPaymentModel,
    urlType = this.defaultPaymentParameters.urlType,
    network = this.defaultPaymentParameters.network
  ): string | Promise<string> {
    return this.getPaymentUrlFactory(urlType).createPaymentUrl(payment, network);
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
    if ('walletSigning' in signingOptions)
      return new WalletSigner(signingOptions.walletSigning);

    return new CustomSigner(signingOptions);
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

  protected validateOptions(options: DeepReadonly<TezosPaymentsOptions>): FailedValidationResults {
    return [
      this.validateServiceContractAddress(options.serviceContractAddress),
      this.validateSigningOptions(options.signing),
      this.validateDefaultPaymentParameters(options.defaultPaymentParameters)
    ].reduce(
      (result, currentErrors) => currentErrors ? (result || []).concat(currentErrors) : result,
      undefined
    );
  }

  private validateServiceContractAddress(serviceContractAddress: string): FailedValidationResults {
    if (!serviceContractAddress || typeof serviceContractAddress !== 'string')
      return [TezosPayments.optionsValidationErrors.invalidServiceContractAddressType];

    if (serviceContractAddress.length !== tezosInfo.addressLength)
      return [TezosPayments.optionsValidationErrors.serviceContractAddressHasInvalidLength];

    if (!tezosInfo.contractAddressPrefixes.some(prefix => serviceContractAddress.startsWith(prefix)))
      return [TezosPayments.optionsValidationErrors.serviceContractAddressIsNotContractAddress];
  }

  private validateSigningOptions(signingOptions: TezosPaymentsOptions['signing']): FailedValidationResults {
    if (typeof signingOptions !== 'object')
      return [TezosPayments.optionsValidationErrors.invalidSigningOption];

    if (typeof signingOptions === 'function')
      return;
    else if (!('apiSecretKey' in signingOptions) && !('walletSigning' in signingOptions))
      return [TezosPayments.optionsValidationErrors.invalidSigningOption];

    if ('apiSecretKey' in signingOptions) {
      if (typeof signingOptions.apiSecretKey !== 'string')
        return [TezosPayments.optionsValidationErrors.invalidApiSecretKeyType];
      if (!signingOptions.apiSecretKey)
        return [TezosPayments.optionsValidationErrors.emptyApiSecretKey];
    }

    if ('walletSigning' in signingOptions && typeof signingOptions.walletSigning !== 'function')
      return [TezosPayments.optionsValidationErrors.invalidWalletSigningOptionType];
  }

  private validateDefaultPaymentParameters(defaultPaymentParameters: TezosPaymentsOptions['defaultPaymentParameters']): FailedValidationResults {
    if (defaultPaymentParameters === undefined)
      return;

    if (typeof defaultPaymentParameters !== 'object')
      return [TezosPayments.optionsValidationErrors.invalidDefaultPaymentParameters];

    if ('network' in defaultPaymentParameters) {
      if (typeof defaultPaymentParameters.network !== 'object')
        return [TezosPayments.optionsValidationErrors.invalidNetwork];

      if (defaultPaymentParameters.network.name === undefined || defaultPaymentParameters.network.name === '')
        return [TezosPayments.optionsValidationErrors.emptyNetworkName];

      if (typeof defaultPaymentParameters.network.name !== 'string' || !networkNameRegExp.test(defaultPaymentParameters.network.name))
        return [TezosPayments.optionsValidationErrors.invalidNetworkName];

      if (defaultPaymentParameters.network.id && (typeof defaultPaymentParameters.network.id !== 'string' || !networkIdRegExp.test(defaultPaymentParameters.network.id)))
        return [TezosPayments.optionsValidationErrors.invalidNetworkId];
    }

    if ('urlType' in defaultPaymentParameters && defaultPaymentParameters.urlType !== PaymentUrlType.Base64)
      return [TezosPayments.optionsValidationErrors.invalidUrlType];
  }
}
