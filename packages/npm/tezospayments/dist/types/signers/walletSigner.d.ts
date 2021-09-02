import { Payment } from '@tezospayments/common';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';
export declare class WalletSigner extends TezosPaymentsSigner {
    readonly walletSigning: (dataBytes: string) => Promise<string>;
    constructor(walletSigning: (dataBytes: string) => Promise<string>);
    sign(_payment: Payment): string | Promise<string>;
}
