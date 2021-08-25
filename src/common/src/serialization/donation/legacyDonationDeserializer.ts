import BigNumber from 'bignumber.js';

import type { NonSerializedDonationSlice, Donation, LegacySerializedDonation } from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer } from '../base64';
import { legacySerializedDonationFieldTypes } from './serializedDonationFieldTypes';

export class LegacyDonationDeserializer {
  protected static readonly serializedDonationBase64Deserializer = new Base64Deserializer<LegacySerializedDonation>(
    legacySerializedDonationFieldTypes
  );

  deserialize(serializedDonationBase64: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null {
    try {
      const serializedDonation = LegacyDonationDeserializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);

      return serializedDonation ? this.mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
    }
    catch {
      return null;
    }
  }

  protected mapSerializedDonationToDonation(serializedDonation: LegacySerializedDonation, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation {
    return {
      type: PaymentType.Donation,
      desiredAmount: serializedDonation.desiredAmount ? new BigNumber(serializedDonation.desiredAmount) : undefined,
      desiredAsset: serializedDonation.desiredAsset,
      successUrl: serializedDonation.successUrl ? new URL(serializedDonation.successUrl) : undefined,
      cancelUrl: serializedDonation.cancelUrl ? new URL(serializedDonation.cancelUrl) : undefined,
      targetAddress: nonSerializedDonationSlice.targetAddress
    };
  }
}
