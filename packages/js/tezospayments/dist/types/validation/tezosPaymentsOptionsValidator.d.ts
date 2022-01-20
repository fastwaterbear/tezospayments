import { CustomNetwork, DeepReadonly, FailedValidationResults, Network } from '@tezospayments/common';
import type { TezosPaymentsApiSigningOptions, TezosPaymentsCustomSigningOptions, TezosPaymentsOptions, TezosPaymentsWalletSigningOptions } from '../options';
export declare class TezosPaymentsOptionsValidator {
    static readonly errors: {
        readonly invalidServiceContractAddressType: "Type of the serviceContractAddress option is invalid";
        readonly serviceContractAddressHasInvalidLength: "The serviceContractAddress option has an invalid address";
        readonly serviceContractAddressIsNotContractAddress: "The serviceContractAddress option isn't a contract address";
        readonly invalidSigningOption: "The signing option is invalid";
        readonly invalidApiSecretKeyType: "The API secret key has an invalid type, it should be a string";
        readonly emptyApiSecretKey: "The API secret key is empty";
        readonly invalidWalletSigningOption: "The \"signing.wallet\" option is invalid";
        readonly invalidWalletSigningPublicKey: "The wallet signing public key has an invalid type, it should be a string";
        readonly emptyWalletSigningPublicKey: "The wallet signing public key is empty";
        readonly invalidWalletSignFunctionType: "The wallet sign function has an invalid type, it should be a function";
        readonly invalidCustomSigningOption: "The \"signing.custom\" option has an invalid type, it should be a function";
        readonly emptyNetworkName: "The network name is empty";
        readonly invalidNetwork: "The network is invalid";
        readonly invalidNetworkName: "The network name is invalid";
        readonly invalidNetworkId: "The network id is invalid";
        readonly invalidDefaultPaymentParameters: "The default payment parameters are invalid";
        readonly invalidUrlType: "The url type is invalid";
    };
    validateOptions(options: DeepReadonly<TezosPaymentsOptions>): FailedValidationResults;
    validateServiceContractAddress(serviceContractAddress: string): FailedValidationResults;
    validateNetwork(network: Network | CustomNetwork | undefined | null): FailedValidationResults;
    validateSigningOptions(signingOptions: TezosPaymentsOptions['signing']): FailedValidationResults;
    validateApiSecretKeySigningOptions(signingOptions: TezosPaymentsApiSigningOptions): FailedValidationResults;
    validateWalletSigningOptions(signingOptions: TezosPaymentsWalletSigningOptions): FailedValidationResults;
    validateCustomSigningOptions(signingOptions: TezosPaymentsCustomSigningOptions): FailedValidationResults;
    validateDefaultPaymentParameters(defaultPaymentParameters: TezosPaymentsOptions['defaultPaymentParameters']): FailedValidationResults;
}
