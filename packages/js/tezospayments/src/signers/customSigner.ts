import type { UnsignedPayment, PaymentSignature } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class CustomSigner extends TezosPaymentsSigner {
  constructor(readonly customSigning: (payment: UnsignedPayment) => PaymentSignature | Promise<PaymentSignature>) {
    super(SigningType.Custom);
  }

  sign(payment: UnsignedPayment): PaymentSignature | Promise<PaymentSignature> {
    return this.customSigning(payment);
  }
}
