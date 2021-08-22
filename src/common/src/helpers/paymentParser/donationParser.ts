import BigNumber from 'bignumber.js';

import type { Donation } from '../../models/payment/donation';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { PaymentFieldInfoType, PaymentParserBase } from './paymentParserBase';

type RawDonationBase = {
  desiredAmount?: string;
  desiredAsset?: string;
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
    .set('desiredAmount', ['string', 'undefined', 'null'])
    .set('desiredAsset', ['string', 'undefined', 'null'])
    .set('successUrl', ['string', 'undefined', 'null'])
    .set('cancelUrl', ['string', 'undefined', 'null']);

  protected get paymentFieldTypes() {
    return this._paymentFieldTypes;
  }

  protected mapRawPaymentToPayment(rawDonation: ValidRawDonation, nonIncludedFields: NonIncludedDonationFields): Donation {
    return {
      type: PaymentType.Donation,
      desiredAmount: rawDonation.desiredAmount ? new BigNumber(rawDonation.desiredAmount) : undefined,
      desiredAsset: rawDonation.desiredAsset,
      successUrl: rawDonation.successUrl ? new URL(rawDonation.successUrl) : undefined,
      cancelUrl: rawDonation.cancelUrl ? new URL(rawDonation.cancelUrl) : undefined,
      targetAddress: nonIncludedFields.targetAddress,
      urls: nonIncludedFields.urls
    };
  }
}
