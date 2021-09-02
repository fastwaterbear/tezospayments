import * as errors from './errors';
import * as paymentUrlFactories from './paymentUrlFactories';
import * as signers from './signers';
export { PaymentUrlType } from '@tezospayments/common';
export type { Payment } from './models';
export { SigningType } from './models';
export type { TezosPaymentsOptions, PaymentCreateParameters } from './options';
export { TezosPayments } from './tezosPayments';
export declare const internal: {
    constants: {
        readonly defaultNetworkName: "mainnet";
        readonly paymentAppBaseUrl: "https://payment.tezospayments.com";
    };
    errors: typeof errors;
    paymentUrlFactories: typeof paymentUrlFactories;
    signers: typeof signers;
};
