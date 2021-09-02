import type { NonSerializedDonationSlice, Donation, SerializedDonation } from '../../models';
import { Base64Deserializer } from '../base64';
export declare class DonationDeserializer {
    protected static readonly serializedDonationBase64Deserializer: Base64Deserializer<SerializedDonation>;
    deserialize(serializedDonationBase64: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null;
    protected mapSerializedDonationToDonation(serializedDonation: SerializedDonation, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation;
}
