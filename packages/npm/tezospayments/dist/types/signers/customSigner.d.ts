import { Payment } from '@tezospayments/common';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';
export declare class CustomSigner extends TezosPaymentsSigner {
    readonly customSigning: (payment: Payment) => Promise<string>;
    constructor(customSigning: (payment: Payment) => Promise<string>);
    sign(_payment: Payment): string | Promise<string>;
}
