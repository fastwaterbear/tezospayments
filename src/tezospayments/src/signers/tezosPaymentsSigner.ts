import { UnsignedPayment, PaymentSignature } from '@tezospayments/common';

import type { SigningType } from '../models';

export abstract class TezosPaymentsSigner {
  constructor(readonly signingType: SigningType) {
  }

  abstract sign(payment: UnsignedPayment): PaymentSignature | Promise<PaymentSignature>;
}
