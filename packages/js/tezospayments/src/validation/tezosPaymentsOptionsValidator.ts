import { CustomNetwork, DeepReadonly, FailedValidationResults, Network, networkIdRegExp, networkNameRegExp, PaymentUrlType, tezosInfo } from '@tezospayments/common';

import type { TezosPaymentsApiSigningOptions, TezosPaymentsCustomSigningOptions, TezosPaymentsOptions, TezosPaymentsWalletSigningOptions } from '../options';

export class TezosPaymentsOptionsValidator {
  static readonly errors = {
    // serviceContractAddress
    invalidServiceContractAddressType: 'Type of the serviceContractAddress option is invalid',
    serviceContractAddressHasInvalidLength: 'The serviceContractAddress option has an invalid address',
    serviceContractAddressIsNotContractAddress: 'The serviceContractAddress option isn\'t a contract address',
    // signing
    invalidSigningOption: 'The signing option is invalid',
    // signing.apiSecretKey
    invalidApiSecretKeyType: 'The API secret key has an invalid type, it should be a string',
    emptyApiSecretKey: 'The API secret key is empty',
    // signing.wallet
    invalidWalletSigningOption: 'The "signing.wallet" option is invalid',
    invalidWalletSigningPublicKey: 'The wallet signing public key has an invalid type, it should be a string',
    emptyWalletSigningPublicKey: 'The wallet signing public key is empty',
    invalidWalletSignFunctionType: 'The wallet sign function has an invalid type, it should be a function',
    // signing.custom
    invalidCustomSigningOption: 'The "signing.custom" option has an invalid type, it should be a function',
    // network
    emptyNetworkName: 'The network name is empty',
    invalidNetwork: 'The network is invalid',
    invalidNetworkName: 'The network name is invalid',
    invalidNetworkId: 'The network id is invalid',
    // defaultPaymentParameters
    invalidDefaultPaymentParameters: 'The default payment parameters are invalid',
    // defaultPaymentParameters.urlType
    invalidUrlType: 'The url type is invalid'
  } as const;

  validateOptions(options: DeepReadonly<TezosPaymentsOptions>): FailedValidationResults {
    return [
      this.validateServiceContractAddress(options.serviceContractAddress),
      this.validateNetwork(options.network),
      this.validateSigningOptions(options.signing),
      this.validateDefaultPaymentParameters(options.defaultPaymentParameters)
    ].reduce(
      (result, currentErrors) => currentErrors ? (result || []).concat(currentErrors) : result,
      undefined
    );
  }

  validateServiceContractAddress(serviceContractAddress: string): FailedValidationResults {
    if (!serviceContractAddress || typeof serviceContractAddress !== 'string')
      return [TezosPaymentsOptionsValidator.errors.invalidServiceContractAddressType];

    if (serviceContractAddress.length !== tezosInfo.addressLength)
      return [TezosPaymentsOptionsValidator.errors.serviceContractAddressHasInvalidLength];

    if (!tezosInfo.contractAddressPrefixes.some(prefix => serviceContractAddress.startsWith(prefix)))
      return [TezosPaymentsOptionsValidator.errors.serviceContractAddressIsNotContractAddress];
  }

  validateNetwork(network: Network | CustomNetwork | undefined | null): FailedValidationResults {
    if (network === undefined || network === null)
      return;

    if (typeof network !== 'object')
      return [TezosPaymentsOptionsValidator.errors.invalidNetwork];

    if (network.name === undefined || network.name === '')
      return [TezosPaymentsOptionsValidator.errors.emptyNetworkName];

    if (typeof network.name !== 'string' || !networkNameRegExp.test(network.name))
      return [TezosPaymentsOptionsValidator.errors.invalidNetworkName];

    if (network.id && (typeof network.id !== 'string' || !networkIdRegExp.test(network.id)))
      return [TezosPaymentsOptionsValidator.errors.invalidNetworkId];
  }

  validateSigningOptions(signingOptions: TezosPaymentsOptions['signing']): FailedValidationResults {
    if (typeof signingOptions !== 'object')
      return [TezosPaymentsOptionsValidator.errors.invalidSigningOption];

    if (!('apiSecretKey' in signingOptions) && !('wallet' in signingOptions) && !('custom' in signingOptions))
      return [TezosPaymentsOptionsValidator.errors.invalidSigningOption];

    if ('apiSecretKey' in signingOptions)
      return this.validateApiSecretKeySigningOptions(signingOptions);

    if ('wallet' in signingOptions)
      return this.validateWalletSigningOptions(signingOptions);

    if ('custom' in signingOptions)
      return this.validateCustomSigningOptions(signingOptions);
  }

  validateApiSecretKeySigningOptions(signingOptions: TezosPaymentsApiSigningOptions): FailedValidationResults {
    if (typeof signingOptions.apiSecretKey !== 'string')
      return [TezosPaymentsOptionsValidator.errors.invalidApiSecretKeyType];
    if (!signingOptions.apiSecretKey)
      return [TezosPaymentsOptionsValidator.errors.emptyApiSecretKey];
  }

  validateWalletSigningOptions(signingOptions: TezosPaymentsWalletSigningOptions): FailedValidationResults {
    if (typeof signingOptions.wallet !== 'object')
      return [TezosPaymentsOptionsValidator.errors.invalidWalletSigningOption];

    if (typeof signingOptions.wallet.signingPublicKey !== 'string')
      return [TezosPaymentsOptionsValidator.errors.invalidWalletSigningPublicKey];
    if (!signingOptions.wallet.signingPublicKey)
      return [TezosPaymentsOptionsValidator.errors.emptyWalletSigningPublicKey];

    if (typeof signingOptions.wallet.sign !== 'function')
      return [TezosPaymentsOptionsValidator.errors.invalidWalletSignFunctionType];
  }

  validateCustomSigningOptions(signingOptions: TezosPaymentsCustomSigningOptions): FailedValidationResults {
    if (typeof signingOptions.custom !== 'function')
      return [TezosPaymentsOptionsValidator.errors.invalidCustomSigningOption];
  }

  validateDefaultPaymentParameters(defaultPaymentParameters: TezosPaymentsOptions['defaultPaymentParameters']): FailedValidationResults {
    if (defaultPaymentParameters === undefined)
      return;

    if (typeof defaultPaymentParameters !== 'object')
      return [TezosPaymentsOptionsValidator.errors.invalidDefaultPaymentParameters];

    if ('urlType' in defaultPaymentParameters && defaultPaymentParameters.urlType !== PaymentUrlType.Base64)
      return [TezosPaymentsOptionsValidator.errors.invalidUrlType];
  }
}
