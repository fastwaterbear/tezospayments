import { BigNumber } from 'bignumber.js';

import type { Payment } from '../../models/payment';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { PaymentFieldInfoType, PaymentParserBase } from './paymentParserBase';

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
export type NonIncludedPaymentFields = Pick<Payment, 'type' | 'targetAddress' | 'urls'>;

export class PaymentParser extends PaymentParserBase<Payment, RawPayment, ValidRawPayment, NonIncludedPaymentFields> {
  private _paymentFieldTypes: ReadonlyMap<
    keyof RawPayment, PaymentFieldInfoType | readonly PaymentFieldInfoType[]
  > = new Map<keyof RawPayment, PaymentFieldInfoType | readonly PaymentFieldInfoType[]>()
    .set('amount', 'string')
    .set('data', 'object')
    .set('asset', ['string', 'undefined', 'null'])
    .set('successUrl', 'string')
    .set('cancelUrl', 'string')
    .set('created', 'string')
    .set('expired', ['string', 'undefined', 'null']);

  protected get paymentFieldTypes() {
    return this._paymentFieldTypes;
  }

  protected mapRawPaymentToPayment(rawPayment: ValidRawPayment, nonIncludedFields: NonIncludedPaymentFields): Payment {
    return {
      type: PaymentType.Payment,
      amount: new BigNumber(rawPayment.amount),
      data: rawPayment.data,
      asset: rawPayment.asset,
      successUrl: new URL(rawPayment.successUrl),
      cancelUrl: new URL(rawPayment.cancelUrl),
      created: new Date(rawPayment.created),
      expired: rawPayment.expired ? new Date(rawPayment.expired) : undefined,
      targetAddress: nonIncludedFields.targetAddress,
      urls: nonIncludedFields.urls
    };
  }
}
