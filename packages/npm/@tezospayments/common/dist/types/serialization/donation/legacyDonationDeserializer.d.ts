import type { NonSerializedDonationSlice, Donation, LegacySerializedDonation } from '../../models';
import { Base64Deserializer } from '../base64';
export declare class LegacyDonationDeserializer {
    protected static readonly serializedDonationBase64Deserializer: Base64Deserializer<LegacySerializedDonation>;
    deserialize(serializedDonationBase64: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null;
    protected mapSerializedDonationToDonation(serializedDonation: LegacySerializedDonation, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation;
}
