import type { CustomNetwork, Network, PaymentAsset, PaymentSignature, PaymentUrlType } from '@tezospayments/common';
import type { Payment } from './models';
export interface TezosPaymentsApiSigningOptions {
    apiSecretKey: string;
}
export interface TezosPaymentsWalletSigningOptions {
    wallet: {
        signingPublicKey: string;
        sign: (dataBytes: string) => Promise<string>;
    };
}
export interface TezosPaymentsCustomSigningOptions {
    custom: (payment: Omit<Payment, 'url' | 'signature'>) => PaymentSignature | Promise<PaymentSignature>;
}
declare type TezosPaymentsSigningOptions = TezosPaymentsApiSigningOptions | TezosPaymentsWalletSigningOptions | TezosPaymentsCustomSigningOptions;
export interface DefaultPaymentParameters {
    urlType: PaymentUrlType;
}
export interface TezosPaymentsOptions {
    serviceContractAddress: string;
    signing: TezosPaymentsSigningOptions;
    network?: Network | CustomNetwork;
    defaultPaymentParameters?: Partial<DefaultPaymentParameters>;
}
interface PaymentCreateParametersBase {
    amount: string;
    id?: string;
    asset?: PaymentAsset;
    data?: Payment['data'];
    created?: number;
    expired?: number;
    successUrl?: string;
    cancelUrl?: string;
}
export declare type PaymentCreateParameters = PaymentCreateParametersBase & {
    urlType?: PaymentUrlType;
};
export {};
