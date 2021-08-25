import { Payment } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class CustomSigner extends TezosPaymentsSigner {
  constructor(readonly customSigning: (payment: Payment) => Promise<string>) {
    super(SigningType.Custom);
  }

  sign(_payment: Payment): string | Promise<string> {
    throw new Error('Method not implemented.');
  }
}
