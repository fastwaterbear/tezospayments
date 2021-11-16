import type { UnsignedDonation, EncodedDonationSignPayload } from '../../models';
export declare class DonationSignPayloadEncoder {
    encode(donation: UnsignedDonation): EncodedDonationSignPayload;
    protected getClientSignPayload(donation: UnsignedDonation): EncodedDonationSignPayload['clientSignPayload'];
}
