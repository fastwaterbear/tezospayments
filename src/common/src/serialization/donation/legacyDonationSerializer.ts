import BigNumber from 'bignumber.js';

import type { NonSerializedDonationSlice, Donation, LegacySerializedDonation } from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer, SerializedFieldType } from '../base64';

export class LegacyDonationSerializer {
  protected static readonly serializedDonationFieldTypes: ReadonlyMap<
    keyof LegacySerializedDonation, SerializedFieldType | readonly SerializedFieldType[]
  > = new Map<keyof LegacySerializedDonation, SerializedFieldType | readonly SerializedFieldType[]>()
    .set('desiredAmount', ['string', 'undefined', 'null'])
    .set('desiredAsset', ['string', 'undefined', 'null'])
    .set('successUrl', ['string', 'undefined', 'null'])
    .set('cancelUrl', ['string', 'undefined', 'null']);
  protected static readonly serializedDonationBase64Deserializer = new Base64Deserializer<LegacySerializedDonation>(
    LegacyDonationSerializer.serializedDonationFieldTypes
  );

  deserialize(serializedDonationBase64: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null {
    try {
      const serializedDonation = LegacyDonationSerializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);

      return serializedDonation ? this.mapDeserializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
    }
    catch {
      return null;
    }
  }

  protected mapDeserializedDonationToDonation(serializedDonation: LegacySerializedDonation, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation {
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
