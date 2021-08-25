import { Payment } from '@tezospayments/common';

import { SigningType } from '../models';
import { TezosPaymentsSigner } from './tezosPaymentsSigner';

export class ApiSecretKeySigner extends TezosPaymentsSigner {
  constructor(readonly apiSecretKey: string) {
    super(SigningType.ApiSecretKey);
  }

  sign(_payment: Payment): string | Promise<string> {
    throw new Error('Method not implemented.');
  }
}
