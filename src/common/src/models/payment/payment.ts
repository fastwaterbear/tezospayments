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
  | { type: 'base64', url: URL };

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

  static validate(_payment: Payment) {
    // TODO: implement
    return true;
  }

  static inTez(payment: Payment) {
    return !!payment.asset;
  }

  static publicDataExists(payment: Payment): payment is Payment & { readonly data: PublicPaymentData };
  static publicDataExists(paymentData: Payment['data']): paymentData is Payment['data'] & PublicPaymentData;
  static publicDataExists(
    paymentOrPaymentDataOrPaymentData: Payment | Payment['data']
  ): paymentOrPaymentDataOrPaymentData is (Payment & { readonly data: PublicPaymentData }) | (Payment['data'] & PublicPaymentData) {
    return !!(Payment.isPayment(paymentOrPaymentDataOrPaymentData)
      ? (paymentOrPaymentDataOrPaymentData.data as PublicPaymentData).public
      : (paymentOrPaymentDataOrPaymentData as PublicPaymentData).public
    );
  }

  static privateDataExists(payment: Payment): payment is Payment & { readonly data: PrivatePaymentData } {
    return !!(payment.data as PrivatePaymentData).private;
  }

  static parse(paymentBase64: string, nonIncludedFields: NonIncludedPaymentFields, parser = Payment.defaultParser): Payment | null {
    return parser.parse(paymentBase64, nonIncludedFields);
  }

  private static isPayment(paymentOrPaymentDataOrPaymentData: Payment | Payment['data']): paymentOrPaymentDataOrPaymentData is Payment {
    return !!(paymentOrPaymentDataOrPaymentData as Payment).amount;
  }
}
