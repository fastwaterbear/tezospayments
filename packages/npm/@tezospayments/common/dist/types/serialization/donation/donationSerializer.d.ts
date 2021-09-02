import type { Donation, SerializedDonation } from '../../models';
import { Base64Serializer } from '../base64';
export declare class DonationSerializer {
    protected static readonly serializedDonationBase64Serializer: Base64Serializer<SerializedDonation>;
    serialize(donation: Donation): string | null;
    protected mapDonationToSerializedDonation(donation: Donation): SerializedDonation;
}
