import BigNumber from 'bignumber.js';

import { PaymentValidator } from '../../helpers';
import { URL } from '../../native';
import { LegacyPaymentDeserializer, PaymentDeserializer } from '../../serialization';
import { StateModel } from '../core';
import { PaymentBase, PaymentType } from './paymentBase';
import { NonSerializedPaymentSlice } from './serializedPayment';

interface PublicPaymentData {
  readonly public: { readonly [fieldName: string]: unknown; };
}

interface PrivatePaymentData {
  readonly private: { readonly [fieldName: string]: unknown; };
}

type PaymentData =
  | PublicPaymentData
  | PrivatePaymentData
  | PublicPaymentData & PrivatePaymentData;

export interface Payment extends PaymentBase {
  readonly type: PaymentType.Payment;
  readonly id: string;
  readonly amount: BigNumber;
  readonly asset?: string;
  readonly data: PaymentData;
  readonly created: Date;
  readonly expired?: Date;
  readonly successUrl?: URL;
  readonly cancelUrl?: URL;
}

export type SignedPayment = Payment & {
  readonly signature: {
    readonly contract: string;
    readonly application?: string;
  };
};

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

  static publicDataExists(payment: Payment): payment is Payment & { readonly data: PublicPaymentData };
  static publicDataExists(paymentData: Payment['data']): paymentData is Payment['data'] & PublicPaymentData;
  static publicDataExists(
    paymentOrPaymentDataOrPaymentData: Payment | Payment['data']
  ): paymentOrPaymentDataOrPaymentData is (Payment & { readonly data: PublicPaymentData }) | (Payment['data'] & PublicPaymentData) {
    return this.publicDataExistsInternal(paymentOrPaymentDataOrPaymentData);
  }

  static privateDataExists(payment: Payment): payment is Payment & { readonly data: PrivatePaymentData } {
    return !!(payment.data as PrivatePaymentData).private;
  }

  protected static publicDataExistsInternal(
    paymentOrPaymentDataOrPaymentData: Payment | Payment['data']
  ): paymentOrPaymentDataOrPaymentData is (Payment & { readonly data: PublicPaymentData }) | (Payment['data'] & PublicPaymentData) {
    return !!(Payment.isPayment(paymentOrPaymentDataOrPaymentData)
      ? (paymentOrPaymentDataOrPaymentData.data as PublicPaymentData).public
      : (paymentOrPaymentDataOrPaymentData as PublicPaymentData).public
    );
  }

  private static isPayment(paymentOrPaymentDataOrPaymentData: Payment | Payment['data']): paymentOrPaymentDataOrPaymentData is Payment {
    return !!(paymentOrPaymentDataOrPaymentData as Payment).amount;
  }
}
