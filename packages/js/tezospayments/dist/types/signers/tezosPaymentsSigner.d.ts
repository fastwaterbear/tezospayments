import { UnsignedPayment, PaymentSignature } from '@tezospayments/common';
import type { SigningType } from '../models';
export declare abstract class TezosPaymentsSigner {
    readonly signingType: SigningType;
    constructor(signingType: SigningType);
    abstract sign(payment: UnsignedPayment): PaymentSignature | Promise<PaymentSignature>;
}
