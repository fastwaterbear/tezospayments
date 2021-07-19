import { BigNumber } from 'bignumber.js';

import { DonationParser, NonIncludedDonationFields, DonationValidator } from '../../helpers';
import { URL } from '../../native';
import { StateModel } from '../core';
import { PaymentBase, PaymentType } from './paymentBase';

export interface Donation extends PaymentBase {
  readonly type: PaymentType.Donation;
  readonly desiredAmount?: BigNumber;
  readonly desiredAsset?: string;
  readonly successUrl?: URL;
  readonly cancelUrl?: URL;
}

export class Donation extends StateModel {
  static readonly defaultParser: DonationParser = new DonationParser();
  static readonly defaultValidator: DonationValidator = new DonationValidator();

  static validate(donation: Donation) {
    return this.defaultValidator.validate(donation);
  }

  static parse(donationBase64: string, nonIncludedFields: NonIncludedDonationFields, parser = Donation.defaultParser): Donation | null {
    return parser.parse(donationBase64, nonIncludedFields);
  }
}

