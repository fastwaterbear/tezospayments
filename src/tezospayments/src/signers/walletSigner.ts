import { Payment } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class WalletSigner extends TezosPaymentsSigner {
  constructor(readonly walletSigning: (dataBytes: string) => Promise<string>) {
    super(SigningType.Wallet);
  }

  sign(_payment: Payment): string | Promise<string> {
    throw new Error('Method not implemented.');
  }
}
