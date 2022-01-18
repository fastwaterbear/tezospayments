import type {
  Donation, DonationAsset, DonationSignature,
  SerializedDonation, SerializedDonationAsset, SerializedDonationSignature
} from '../../models';
import { Base64Serializer } from '../base64';
import { serializedDonationFieldTypes } from './serializedDonationFieldTypes';

const serializedEmptyObjectBase64 = 'e30';
export class DonationSerializer {
  protected static readonly serializedDonationBase64Serializer = new Base64Serializer<SerializedDonation>(
    serializedDonationFieldTypes
  );

  serialize(donation: Donation): string | null {
    try {
      const serializedDonation = this.mapDonationToSerializedDonation(donation);
      const serializedDonationBase64 = DonationSerializer.serializedDonationBase64Serializer.serialize(serializedDonation);

      return serializedDonationBase64 === serializedEmptyObjectBase64 ? '' : serializedDonationBase64;
    }
    catch {
      return null;
    }
  }

  protected mapDonationToSerializedDonation(donation: Donation): SerializedDonation {
    return {
      d: donation.data,
      da: donation.desiredAmount?.toString(10),
      das: donation.desiredAsset ? this.mapDonationAssetToSerializedDonationAsset(donation.desiredAsset) : undefined,
      su: donation.successUrl?.toString(),
      cu: donation.cancelUrl?.toString(),
      s: donation.signature ? this.mapDonationSignatureToSerializedDonationSignature(donation.signature) : undefined
    };
  }

  protected mapDonationAssetToSerializedDonationAsset(donationAsset: DonationAsset): SerializedDonationAsset {
    return {
      a: donationAsset.address,
      i: donationAsset.id !== null ? donationAsset.id : undefined
    };
  }

  protected mapDonationSignatureToSerializedDonationSignature(donationSignature: DonationSignature): SerializedDonationSignature {
    return {
      k: donationSignature.signingPublicKey,
      cl: donationSignature.client
    };
  }
}
