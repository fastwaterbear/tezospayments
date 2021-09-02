import { Payment } from '@tezospayments/common';
import type { SigningType } from '../models';
export declare abstract class TezosPaymentsSigner {
    readonly signingType: SigningType;
    constructor(signingType: SigningType);
    abstract sign(payment: Payment): string | Promise<string>;
}
