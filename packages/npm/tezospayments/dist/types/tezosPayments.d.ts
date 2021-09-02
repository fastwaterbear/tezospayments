import { PaymentUrlType, DeepReadonly, FailedValidationResults, Payment as CommonPaymentModel, PaymentValidator } from '@tezospayments/common';
import { Payment } from './models';
import type { DefaultPaymentParameters, PaymentCreateParameters, TezosPaymentsOptions } from './options';
import { PaymentUrlFactory } from './paymentUrlFactories';
import { TezosPaymentsSigner } from './signers';
export declare class TezosPayments {
    static readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters>;
    protected static readonly optionsValidationErrors: {
        readonly invalidServiceContractAddressType: "Type of the serviceContractAddress option is invalid";
        readonly serviceContractAddressHasInvalidLength: "The serviceContractAddress option has an invalid address";
        readonly serviceContractAddressIsNotContractAddress: "The serviceContractAddress option isn't a contract address";
        readonly invalidSigningOption: "The signing option is invalid";
        readonly invalidApiSecretKeyType: "The API secret key has an invalid type, it should be a string";
        readonly emptyApiSecretKey: "The API secret key is empty";
        readonly invalidWalletSigningOptionType: "The WalletSigning option has an invalid type, it should be a function";
        readonly invalidDefaultPaymentParameters: "The default payment parameters are invalid";
        readonly emptyNetworkName: "The network name is empty";
        readonly invalidNetwork: "The network is invalid";
        readonly invalidNetworkName: "The network name is invalid";
        readonly invalidNetworkId: "The network id is invalid";
        readonly invalidUrlType: "The url type is invalid";
    };
    protected readonly paymentValidator: PaymentValidator;
    protected readonly serviceContractAddress: string;
    protected readonly signer: TezosPaymentsSigner;
    protected readonly defaultPaymentParameters: DeepReadonly<DefaultPaymentParameters>;
    private paymentUrlFactories;
    constructor(options: DeepReadonly<TezosPaymentsOptions>);
    createPayment(createParameters: PaymentCreateParameters): Promise<Payment>;
    protected getPaymentUrl(payment: CommonPaymentModel, urlType?: PaymentUrlType, network?: {
        readonly id: "NetXz969SFaFn8k";
        readonly name: "granadanet";
    } | {
        readonly id: "NetXSgo1ZT2DRUG";
        readonly name: "edo2net";
    } | {
        readonly id?: string | undefined;
        readonly name: string;
    }): string | Promise<string>;
    protected applyPaymentUrl(payment: CommonPaymentModel, url: string): Payment;
    protected getPaymentUrlFactory(paymentUrlType: PaymentUrlType): PaymentUrlFactory;
    protected createSigner(signingOptions: TezosPaymentsOptions['signing']): TezosPaymentsSigner;
    protected createPaymentUrlFactory(paymentUrlType: PaymentUrlType): PaymentUrlFactory;
    protected createPaymentByCreateParameters(createParameters: PaymentCreateParameters): CommonPaymentModel;
    protected validateOptions(options: DeepReadonly<TezosPaymentsOptions>): FailedValidationResults;
    private validateServiceContractAddress;
    private validateSigningOptions;
    private validateDefaultPaymentParameters;
}
