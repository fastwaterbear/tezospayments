import { UnsignedPayment, PaymentSignature, PaymentSignPayloadEncoder } from '@tezospayments/common';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';
export declare class WalletSigner extends TezosPaymentsSigner {
    readonly walletSigning: (dataBytes: string) => Promise<string>;
    protected readonly paymentSignPayloadEncoder: PaymentSignPayloadEncoder;
    constructor(walletSigning: (dataBytes: string) => Promise<string>);
    sign(payment: UnsignedPayment): Promise<PaymentSignature>;
}
