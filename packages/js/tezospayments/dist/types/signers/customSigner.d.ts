import type { UnsignedPayment, PaymentSignature } from '@tezospayments/common';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';
export declare class CustomSigner extends TezosPaymentsSigner {
    readonly customSigning: (payment: UnsignedPayment) => PaymentSignature | Promise<PaymentSignature>;
    constructor(customSigning: (payment: UnsignedPayment) => PaymentSignature | Promise<PaymentSignature>);
    sign(payment: UnsignedPayment): PaymentSignature | Promise<PaymentSignature>;
}
