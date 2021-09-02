import BigNumber from 'bignumber.js';

import { DonationValidator } from '../../helpers';
import { URL } from '../../native';
import { DonationDeserializer, LegacyDonationDeserializer } from '../../serialization';
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
  static readonly defaultDeserializer: DonationDeserializer = new DonationDeserializer();
  static readonly defaultLegacyDeserializer: LegacyDonationDeserializer = new LegacyDonationDeserializer();
  static readonly defaultValidator: DonationValidator = new DonationValidator();

  static validate(donation: Donation) {
    return this.defaultValidator.validate(donation);
  }

  static deserialize(serializedDonation: string, nonSerializedDonationSlice: NonSerializedDonationSlice, isLegacy = false): Donation | null {
    return !isLegacy
      ? Donation.defaultDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice)
      : Donation.defaultLegacyDeserializer.deserialize(serializedDonation, nonSerializedDonationSlice);
  }
}

