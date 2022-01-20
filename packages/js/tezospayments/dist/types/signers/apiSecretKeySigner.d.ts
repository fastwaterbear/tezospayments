import { InMemorySigner } from '@taquito/signer';
import { PaymentSignPayloadEncoder, PaymentSignature, UnsignedPayment } from '@tezospayments/common';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';
export declare class ApiSecretKeySigner extends TezosPaymentsSigner {
    readonly apiSecretKey: string;
    protected readonly paymentSignPayloadEncoder: PaymentSignPayloadEncoder;
    protected readonly inMemorySigner: InMemorySigner;
    constructor(apiSecretKey: string);
    sign(payment: UnsignedPayment): Promise<PaymentSignature>;
}
