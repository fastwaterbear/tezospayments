import { BigNumber } from 'bignumber.js';

import type { Donation } from '../../models/payment/donation';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { PaymentFieldInfoType, PaymentParserBase } from './paymentParserBase';

type RawDonationBase = {
  amount: string;
  created: Date;
  asset?: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type RawDonation = Partial<RawDonationBase>;
export type ValidRawDonation = RawDonationBase;
export type NonIncludedDonationFields = Pick<Donation, 'type' | 'targetAddress' | 'urls'>;

export class DonationParser extends PaymentParserBase<Donation, RawDonation, ValidRawDonation, NonIncludedDonationFields> {
  private _paymentFieldTypes: ReadonlyMap<
    keyof RawDonation, PaymentFieldInfoType | readonly PaymentFieldInfoType[]
  > = new Map<keyof RawDonation, PaymentFieldInfoType | readonly PaymentFieldInfoType[]>()
    .set('amount', 'string')
    .set('asset', ['string', 'undefined', 'null'])
    .set('successUrl', ['string', 'undefined', 'null'])
    .set('cancelUrl', ['string', 'undefined', 'null'])
    .set('created', 'string');

  protected get paymentFieldTypes() {
    return this._paymentFieldTypes;
  }

  protected mapRawPaymentToPayment(rawDonation: ValidRawDonation, nonIncludedFields: NonIncludedDonationFields): Donation {
    return {
      type: PaymentType.Donation,
      amount: new BigNumber(rawDonation.amount),
      asset: rawDonation.asset,
      successUrl: rawDonation.successUrl ? new URL(rawDonation.successUrl) : undefined,
      cancelUrl: rawDonation.cancelUrl ? new URL(rawDonation.cancelUrl) : undefined,
      created: new Date(rawDonation.created),
      targetAddress: nonIncludedFields.targetAddress,
      urls: nonIncludedFields.urls
    };
  }
}
