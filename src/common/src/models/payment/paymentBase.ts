import { BigNumber } from 'bignumber.js';

import { URL } from '../../native';
import { StateModel } from '../core';

export enum PaymentType {
  Payment = 1,
  Donation = 2
}

export interface PublicPaymentData {
  readonly public: { readonly [fieldName: string]: unknown; };
}

export interface PrivatePaymentData {
  readonly private: { readonly [fieldName: string]: unknown; };
}

export type PaymentData =
  | PublicPaymentData
  | PrivatePaymentData
  | PublicPaymentData & PrivatePaymentData;

export type PaymentUrl =
  | { type: 'base64', url: URL };

export interface PaymentBase {
  readonly type: PaymentType;
  readonly targetAddress: string;
  readonly amount: BigNumber;
  readonly data: PaymentData;
  readonly asset?: string;
  readonly created: Date;
  readonly urls: readonly PaymentUrl[];
}

export class PaymentBase extends StateModel {
  static inTez(payment: PaymentBase) {
    return !!payment.asset;
  }

  static publicDataExists(payment: PaymentBase): payment is PaymentBase & { readonly data: PublicPaymentData };
  static publicDataExists(paymentData: PaymentBase['data']): paymentData is PaymentBase['data'] & PublicPaymentData;
  static publicDataExists(
    paymentOrPaymentDataOrPaymentData: PaymentBase | PaymentBase['data']
  ): paymentOrPaymentDataOrPaymentData is (PaymentBase & { readonly data: PublicPaymentData }) | (PaymentBase['data'] & PublicPaymentData) {
    return this.publicDataExistsInternal(paymentOrPaymentDataOrPaymentData);
  }

  static privateDataExists(payment: PaymentBase): payment is PaymentBase & { readonly data: PrivatePaymentData } {
    return !!(payment.data as PrivatePaymentData).private;
  }

  protected static publicDataExistsInternal(
    paymentOrPaymentDataOrPaymentData: PaymentBase | PaymentBase['data']
  ): paymentOrPaymentDataOrPaymentData is (PaymentBase & { readonly data: PublicPaymentData }) | (PaymentBase['data'] & PublicPaymentData) {
    return !!(PaymentBase.isPayment(paymentOrPaymentDataOrPaymentData)
      ? (paymentOrPaymentDataOrPaymentData.data as PublicPaymentData).public
      : (paymentOrPaymentDataOrPaymentData as PublicPaymentData).public
    );
  }

  private static isPayment(paymentOrPaymentDataOrPaymentData: PaymentBase | PaymentBase['data']): paymentOrPaymentDataOrPaymentData is PaymentBase {
    return !!(paymentOrPaymentDataOrPaymentData as PaymentBase).amount;
  }
}
