import type { Donation, DonationAsset, DonationSignature, SerializedDonation, SerializedDonationAsset, SerializedDonationSignature } from '../../models';
import { Base64Serializer } from '../base64';
export declare class DonationSerializer {
    protected static readonly serializedDonationBase64Serializer: Base64Serializer<SerializedDonation>;
    serialize(donation: Donation): string | null;
    protected mapDonationToSerializedDonation(donation: Donation): SerializedDonation;
    protected mapDonationAssetToSerializedDonationAsset(donationAsset: DonationAsset): SerializedDonationAsset;
    protected mapDonationSignatureToSerializedDonationSignature(donationSignature: DonationSignature): SerializedDonationSignature;
}
