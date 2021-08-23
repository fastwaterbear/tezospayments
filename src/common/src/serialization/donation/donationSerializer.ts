import BigNumber from 'bignumber.js';

import type { NonSerializedDonationSlice, Donation, SerializedDonation } from '../../models';
import { PaymentType } from '../../models/payment/paymentBase';
import { URL } from '../../native';
import { Base64Deserializer, SerializedFieldType } from '../base64';

export class DonationSerializer {
  protected static readonly serializedDonationFieldTypes: ReadonlyMap<
    keyof SerializedDonation, SerializedFieldType | readonly SerializedFieldType[]
  > = new Map<keyof SerializedDonation, SerializedFieldType | readonly SerializedFieldType[]>()
    // desiredAmount
    .set('da', ['string', 'undefined', 'null'])
    // desiredAsset
    .set('das', ['string', 'undefined', 'null'])
    // successUrl
    .set('su', ['string', 'undefined', 'null'])
    // cancelUrl
    .set('cu', ['string', 'undefined', 'null']);
  protected static readonly serializedDonationBase64Deserializer = new Base64Deserializer<SerializedDonation>(
    DonationSerializer.serializedDonationFieldTypes
  );

  deserialize(serializedDonationBase64: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null {
    try {
      const serializedDonation = DonationSerializer.serializedDonationBase64Deserializer.deserialize(serializedDonationBase64);

      return serializedDonation ? this.mapDeserializedDonationToDonation(serializedDonation, nonSerializedDonationSlice) : null;
    }
    catch {
      return null;
    }
  }

  protected mapDeserializedDonationToDonation(serializedDonation: SerializedDonation, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation {
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
