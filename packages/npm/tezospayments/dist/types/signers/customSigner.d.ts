import type { UnsignedPayment, PaymentSignature } from '@tezospayments/common';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';
export declare class CustomSigner extends TezosPaymentsSigner {
    readonly customSigning: (payment: UnsignedPayment) => Promise<string>;
    constructor(customSigning: (payment: UnsignedPayment) => Promise<string>);
    sign(_payment: UnsignedPayment): PaymentSignature | Promise<PaymentSignature>;
}
