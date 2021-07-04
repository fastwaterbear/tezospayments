import { BigNumber } from 'bignumber.js';

import type { Payment } from '../models/payment';
import { URL } from '../native';

type RawPaymentBase = {
  amount: string;
  data: Payment['data'];
  asset?: string;
  successUrl: string;
  cancelUrl: string;
  created: Date;
  expired?: Date;
};

export type RawPayment = Partial<RawPaymentBase>;
export type ValidRawPayment = RawPaymentBase;

type PaymentFieldInfoType = 'object' | 'string' | 'undefined' | 'null';

export type NonIncludedPaymentFields = Pick<Payment, 'targetAddress' | 'urls'>;

export class PaymentParser {
  private _minPaymentFieldsCount: number | undefined;
  private paymentFieldTypes: ReadonlyMap<
    keyof RawPayment, PaymentFieldInfoType | readonly PaymentFieldInfoType[]
  > = new Map<keyof RawPayment, PaymentFieldInfoType | readonly PaymentFieldInfoType[]>()
    .set('amount', 'string')
    .set('data', 'object')
    .set('asset', ['string', 'undefined', 'null'])
    .set('successUrl', 'string')
    .set('cancelUrl', 'string')
    .set('created', 'string')
    .set('expired', ['string', 'undefined', 'null']);

  private get minPaymentFieldsCount() {
    if (!this._minPaymentFieldsCount) {
      let count = 0;
      for (const info of this.paymentFieldTypes) {
        if (typeof info[1] === 'string' ? info[1] !== 'undefined' : info[1].every(type => type !== 'undefined'))
          count++;
      }

      this._minPaymentFieldsCount = count;
    }

    return this._minPaymentFieldsCount;
  }

  private get maxPaymentFieldsCount() {
    return this.paymentFieldTypes.size;
  }

  parse(paymentBase64: string, nonIncludedFields: NonIncludedPaymentFields): Payment | null {
    try {
      const paymentString = Buffer.from(paymentBase64, 'base64').toString('utf8');
      const rawPayment: RawPayment = JSON.parse(paymentString);

      return this.mapRawPaymentToPayment(rawPayment, nonIncludedFields);
    }
    catch {
      return null;
    }
  }

  private mapRawPaymentToPayment(rawPayment: RawPayment, nonIncludedFields: NonIncludedPaymentFields): Payment | null {
    return this.validateRawPayment(rawPayment)
      ? {
        amount: new BigNumber(rawPayment.amount),
        data: rawPayment.data,
        asset: rawPayment.asset,
        successUrl: new URL(rawPayment.successUrl),
        cancelUrl: new URL(rawPayment.cancelUrl),
        created: new Date(rawPayment.created),
        expired: rawPayment.expired ? new Date(rawPayment.expired) : undefined,
        targetAddress: nonIncludedFields.targetAddress,
        urls: nonIncludedFields.urls
      }
      : null;
  }

  private validateRawPayment(rawPayment: RawPayment): rawPayment is ValidRawPayment {
    const rawPaymentFieldNames = Object.getOwnPropertyNames(rawPayment) as ReadonlyArray<keyof RawPayment>;

    // Prevent the field checking if the rawPayment has an invalid number of fields
    if (rawPaymentFieldNames.length < this.minPaymentFieldsCount || rawPaymentFieldNames.length > this.maxPaymentFieldsCount)
      return false;

    for (const rawPaymentFieldName of rawPaymentFieldNames) {
      const actualPaymentFieldType = typeof rawPayment[rawPaymentFieldName];
      const expectedPaymentFieldType = this.paymentFieldTypes.get(rawPaymentFieldName);

      if (!expectedPaymentFieldType)
        return false;

      if (typeof expectedPaymentFieldType === 'string'
        ? actualPaymentFieldType !== expectedPaymentFieldType
        : !expectedPaymentFieldType.some(expectedType => actualPaymentFieldType === expectedType)
      ) {
        return false;
      }
    }

    return true;
  }
}
