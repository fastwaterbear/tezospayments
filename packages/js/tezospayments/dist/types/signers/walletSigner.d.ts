import { UnsignedPayment, PaymentSignature, PaymentSignPayloadEncoder } from '@tezospayments/common';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';
export declare class WalletSigner extends TezosPaymentsSigner {
    readonly signingPublicKey: string;
    readonly walletSignCallback: (dataBytes: string) => Promise<string>;
    protected readonly paymentSignPayloadEncoder: PaymentSignPayloadEncoder;
    constructor(signingPublicKey: string, walletSignCallback: (dataBytes: string) => Promise<string>);
    sign(payment: UnsignedPayment): Promise<PaymentSignature>;
}
