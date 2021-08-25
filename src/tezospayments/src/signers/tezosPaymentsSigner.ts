import { Payment } from '@tezospayments/common';

import type { SigningType } from '../models';

export abstract class TezosPaymentsSigner {
  constructor(readonly signingType: SigningType) {
  }

  abstract sign(payment: Payment): string | Promise<string>;
}
