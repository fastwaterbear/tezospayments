import type { UnsignedPayment, PaymentSignature } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class CustomSigner extends TezosPaymentsSigner {
  constructor(readonly customSigning: (payment: UnsignedPayment) => Promise<string>) {
    super(SigningType.Custom);
  }

  sign(_payment: UnsignedPayment): PaymentSignature | Promise<PaymentSignature> {
    throw new Error('Method not implemented.');
  }
}
