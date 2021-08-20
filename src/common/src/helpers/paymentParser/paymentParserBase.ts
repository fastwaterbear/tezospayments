import { Buffer } from 'buffer';

import { PaymentBase } from '../../models/payment/paymentBase';

export type PaymentFieldInfoType = 'object' | 'string' | 'number' | 'undefined' | 'null';

export abstract class PaymentParserBase<
  TPayment extends PaymentBase,
  TRawPayment extends Record<string, unknown>,
  TValidRawPayment extends TRawPayment,
  TNonIncludedFields extends Record<string, unknown>
  > {
  private _minPaymentFieldsCount: number | undefined;

  protected abstract get paymentFieldTypes(): ReadonlyMap<keyof TRawPayment, PaymentFieldInfoType | readonly PaymentFieldInfoType[]>;

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

  parse(paymentBase64: string, nonIncludedFields: TNonIncludedFields): TPayment | null {
    try {
      let rawPayment: TRawPayment;

      if (paymentBase64) {
        const paymentString = Buffer.from(paymentBase64, 'base64').toString('utf8');
        rawPayment = JSON.parse(paymentString);
      }
      else
        rawPayment = {} as TRawPayment;

      return this.validateAndMapRawPaymentToPayment(rawPayment, nonIncludedFields);
    }
    catch {
      return null;
    }
  }

  protected abstract mapRawPaymentToPayment(rawPayment: TValidRawPayment, nonIncludedFields: TNonIncludedFields): TPayment;

  private validateAndMapRawPaymentToPayment(rawPayment: TRawPayment, nonIncludedFields: TNonIncludedFields): TPayment | null {
    return this.validateRawPayment(rawPayment)
      ? this.mapRawPaymentToPayment(rawPayment, nonIncludedFields)
      : null;
  }

  private validateRawPayment(rawPayment: TRawPayment): rawPayment is TValidRawPayment {
    const rawPaymentFieldNames = Object.getOwnPropertyNames(rawPayment) as ReadonlyArray<keyof TRawPayment>;

    // Prevent the field checking if the rawPayment has an invalid number of fields
    if (rawPaymentFieldNames.length < this.minPaymentFieldsCount || rawPaymentFieldNames.length > this.maxPaymentFieldsCount)
      return false;

    for (const [rawPaymentFieldName, expectedPaymentFieldType] of this.paymentFieldTypes) {
      const actualPaymentFieldType = typeof rawPayment[rawPaymentFieldName];

      if (Array.isArray(expectedPaymentFieldType)
        ? !expectedPaymentFieldType.some(expectedType => actualPaymentFieldType === expectedType)
        : actualPaymentFieldType !== expectedPaymentFieldType
      ) {
        return false;
      }
    }

    return true;
  }
}
