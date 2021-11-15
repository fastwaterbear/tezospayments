import BigNumber from 'bignumber.js';

import { PaymentValidator } from '../../helpers';
import { URL } from '../../native';
import { PaymentDeserializer } from '../../serialization';
import { StateModel } from '../core';
import type { PaymentSignature } from '../signing';
import { PaymentBase, PaymentType } from './paymentBase';
import { NonSerializedPaymentSlice } from './serializedPayment';

export interface Payment extends PaymentBase {
  readonly type: PaymentType.Payment;
  readonly id: string;
  readonly amount: BigNumber;
  readonly asset?: PaymentAsset;
  readonly created: Date;
  readonly expired?: Date;
  readonly data?: PaymentData;
  readonly successUrl?: URL;
  readonly cancelUrl?: URL;
  readonly signature: PaymentSignature;
}

export type UnsignedPayment = Omit<Payment, 'signature'>;

interface PaymentData {
  readonly [fieldName: string]: unknown;
}

export interface PaymentAsset {
  readonly address: string;
  readonly decimals: number;
  readonly id: number | null;
}

export class Payment extends StateModel {
  static readonly defaultDeserializer: PaymentDeserializer = new PaymentDeserializer();
  static readonly defaultValidator: PaymentValidator = new PaymentValidator();

  static validate(payment: Payment) {
    return Payment.defaultValidator.validate(payment);
  }

  static deserialize(serializedPayment: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice): Payment | null {
    return Payment.defaultDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice);
  }
}
