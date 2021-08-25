import {
  DeepReadonly, FailedValidationResults,
  networks, tezosInfo, networkNameRegExp, networkIdRegExp
} from '@tezospayments/common';

import { InvalidTezosPaymentsOptionsError } from './errors';
import { Payment, PaymentUrlType } from './models';
import type { DefaultPaymentParameters, PaymentCreateParameters, TezosPaymentsOptions } from './options';
import { ApiSecretKeySigner, CustomSigner, TezosPaymentsSigner, WalletSigner } from './signers';
import { tezosPaymentsOptionsValidationErrors } from './validationErrors';

export class TezosPayments {
  static readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters> = {
    network: networks.granadanet,
    urlType: PaymentUrlType.Base64
  };

  protected readonly serviceContractAddress: string;
  protected readonly signer: TezosPaymentsSigner;
  protected readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters>;

  protected static readonly optionsValidationErrors = tezosPaymentsOptionsValidationErrors;

  constructor(options: DeepReadonly<TezosPaymentsOptions>) {
    const errors = this.validateOptions(options);
    if (errors)
      throw new InvalidTezosPaymentsOptionsError(errors);

    this.serviceContractAddress = options.serviceContractAddress;
    this.signer = this.createSigner(options.signing);
    this.defaultPaymentParameters = options.defaultPaymentParameters
      ? {
        network: options.defaultPaymentParameters.network || TezosPayments.defaultPaymentParameters.network,
        urlType: options.defaultPaymentParameters.urlType || TezosPayments.defaultPaymentParameters.urlType
      }
      : TezosPayments.defaultPaymentParameters;
  }

  async createPayment(_createParameters: PaymentCreateParameters): Promise<Payment> {
    throw new Error('Method not implemented.');
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

  protected createSigner(signingOptions: TezosPaymentsOptions['signing']): TezosPaymentsSigner {
    if ('apiSecretKey' in signingOptions)
      return new ApiSecretKeySigner(signingOptions.apiSecretKey);
    if ('walletSigning' in signingOptions)
      return new WalletSigner(signingOptions.walletSigning);

    return new CustomSigner(signingOptions);
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
        return [TezosPayments.optionsValidationErrors.invalidNetworkName];

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
