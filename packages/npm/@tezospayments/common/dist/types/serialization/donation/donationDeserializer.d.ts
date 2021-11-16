import type { NonSerializedDonationSlice, Donation, DonationAsset, DonationSignature, SerializedDonation, SerializedDonationSignature, SerializedDonationAsset } from '../../models';
import { Base64Deserializer } from '../base64';
export declare class DonationDeserializer {
    protected static readonly serializedDonationBase64Deserializer: Base64Deserializer<SerializedDonation>;
    deserialize(serializedDonationBase64: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null;
    protected mapSerializedDonationToDonation(serializedDonation: SerializedDonation, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation;
    protected mapSerializedDonationAssetToDonationAsset(serializedDonationAsset: SerializedDonationAsset): DonationAsset;
    protected mapSerializedDonationSignatureToDonationSignature(serializedDonationSignature: SerializedDonationSignature): DonationSignature;
}
