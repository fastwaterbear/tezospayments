import { Payment } from '@tezospayments/common';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';
export declare class ApiSecretKeySigner extends TezosPaymentsSigner {
    readonly apiSecretKey: string;
    constructor(apiSecretKey: string);
    sign(_payment: Payment): string | Promise<string>;
}
