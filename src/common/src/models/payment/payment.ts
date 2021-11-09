import BigNumber from 'bignumber.js';

import { PaymentValidator } from '../../helpers';
import { URL } from '../../native';
import { LegacyPaymentDeserializer, PaymentDeserializer } from '../../serialization';
import { StateModel } from '../core';
import type { PaymentSignature } from '../signing';
import { PaymentBase, PaymentType } from './paymentBase';
import { NonSerializedPaymentSlice } from './serializedPayment';

interface PaymentData {
  readonly [fieldName: string]: unknown;
}

export interface Payment extends PaymentBase {
  readonly type: PaymentType.Payment;
  readonly id: string;
  readonly amount: BigNumber;
  readonly asset?: string;
  readonly created: Date;
  readonly expired?: Date;
  readonly data?: PaymentData;
  readonly successUrl?: URL;
  readonly cancelUrl?: URL;
  readonly signature: PaymentSignature;
}

export type UnsignedPayment = Omit<Payment, 'signature'>;

export class Payment extends StateModel {
  static readonly defaultDeserializer: PaymentDeserializer = new PaymentDeserializer();
  static readonly defaultLegacyDeserializer: LegacyPaymentDeserializer = new LegacyPaymentDeserializer();
  static readonly defaultValidator: PaymentValidator = new PaymentValidator();

  static validate(payment: Payment) {
    return this.defaultValidator.validate(payment);
  }

  static deserialize(serializedPayment: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice, isLegacy = false): Payment | null {
    return !isLegacy
      ? Payment.defaultDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice)
      : Payment.defaultLegacyDeserializer.deserialize(serializedPayment, nonSerializedPaymentSlice);
  }
}
