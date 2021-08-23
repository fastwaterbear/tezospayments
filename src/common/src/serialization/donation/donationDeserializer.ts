import BigNumber from 'bignumber.js';

import type { NonSerializedDonationSlice, Donation, SerializedDonation } from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer } from '../base64';
import { serializedDonationFieldTypes } from './serializedDonationFieldTypes';

export class DonationDeserializer {
  protected static readonly serializedDonationBase64Deserializer = new Base64Deserializer<SerializedDonation>(
    serializedDonationFieldTypes
  );

  deserialize(serializedDonationBase64: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null {
    try {
      const serializedDonation = DonationDeserializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);

      return serializedDonation ? this.mapSerializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
    }
    catch {
      return null;
    }
  }

  protected mapSerializedDonationToDonation(serializedDonation: SerializedDonation, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation {
    return {
      type: PaymentType.Donation,
      desiredAmount: serializedDonation.da ? new BigNumber(serializedDonation.da) : undefined,
      desiredAsset: serializedDonation.das,
      successUrl: serializedDonation.su ? new URL(serializedDonation.su) : undefined,
      cancelUrl: serializedDonation.cu ? new URL(serializedDonation.cu) : undefined,
      targetAddress: nonSerializedDonationSlice.targetAddress
    };
  }
}