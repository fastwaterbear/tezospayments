import { BigNumber } from 'bignumber.js';

import { PaymentParser, NonIncludedPaymentFields } from '../../helpers';
import { URL } from '../../native';
import { StateModel } from '../core';

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

type PaymentUrl =
  | { type: 'base64', url: string };

export interface Payment {
  readonly targetAddress: string;
  readonly amount: BigNumber;
  readonly data: PaymentData;
  readonly asset?: string;
  readonly successUrl: URL;
  readonly cancelUrl: URL;
  readonly created: Date;
  readonly expired?: Date;
  readonly urls: readonly PaymentUrl[];
}

export class Payment extends StateModel {
  static readonly defaultParser: PaymentParser = new PaymentParser();

  static inTez(payment: Payment) {
    return !!payment.asset;
  }

  static publicDataExists(payment: Payment): payment is Payment & { readonly data: PublicPaymentData } {
    return !!(payment.data as PublicPaymentData).public;
  }

  static privateDataExists(payment: Payment): payment is Payment & { readonly data: PrivatePaymentData } {
    return !!(payment.data as PrivatePaymentData).private;
  }

  static parse(paymentBase64: string, nonIncludedFields: NonIncludedPaymentFields, parser = Payment.defaultParser): Payment | null {
    return parser.parse(paymentBase64, nonIncludedFields);
  }
}
