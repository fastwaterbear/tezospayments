import BigNumber from 'bignumber.js';

import { DonationValidator } from '../../helpers';
import { URL } from '../../native';
import { LegacyDonationDeserializer } from '../../serialization';
import { StateModel } from '../core';
import { PaymentBase, PaymentType } from './paymentBase';
import { NonSerializedDonationSlice } from './serializedDonation';

export interface Donation extends PaymentBase {
  readonly type: PaymentType.Donation;
  readonly desiredAmount?: BigNumber;
  readonly desiredAsset?: string;
  readonly successUrl?: URL;
  readonly cancelUrl?: URL;
}

export class Donation extends StateModel {
  static readonly defaultLegacyDeserializer: LegacyDonationDeserializer = new LegacyDonationDeserializer();
  static readonly defaultValidator: DonationValidator = new DonationValidator();

  static validate(donation: Donation) {
    return this.defaultValidator.validate(donation);
  }

  static deserialize(donationBase64: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null {
    return Donation.defaultLegacyDeserializer.deserialize(donationBase64, nonSerializedDonationSlice);
  }
}

