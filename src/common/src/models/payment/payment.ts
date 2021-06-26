import { BigNumber } from 'bignumber.js';

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

export interface Payment {
  readonly amount: BigNumber;
  readonly data: PaymentData;
  readonly asset?: string;
  readonly successUrl: string;
  readonly cancelUrl: string;
  readonly created: Date;
  readonly expired?: Date;
}

export class Payment extends StateModel {
  static inTez(payment: Payment) {
    return !!payment.asset;
  }

  static publicDataExists(payment: Payment): payment is Payment & { readonly data: PublicPaymentData } {
    return !!(payment.data as PublicPaymentData).public;
  }

  static privateDataExists(payment: Payment): payment is Payment & { readonly data: PrivatePaymentData } {
    return !!(payment.data as PrivatePaymentData).private;
  }
}
