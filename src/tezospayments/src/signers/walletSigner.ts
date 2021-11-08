import type { UnsignedPayment, PaymentSignature } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class WalletSigner extends TezosPaymentsSigner {
  constructor(readonly walletSigning: (dataBytes: string) => Promise<string>) {
    super(SigningType.Wallet);
  }

  sign(_payment: UnsignedPayment): PaymentSignature | Promise<PaymentSignature> {
    throw new Error('Method not implemented.');
  }
}
