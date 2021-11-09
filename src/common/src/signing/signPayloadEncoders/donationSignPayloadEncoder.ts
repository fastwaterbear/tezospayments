
import type { UnsignedDonation, EncodedDonationSignPayload } from '../../models';

export class DonationSignPayloadEncoder {
  encode(donation: UnsignedDonation): EncodedDonationSignPayload {
    return {
      clientSignPayload: this.getClientSignPayload(donation)
    };
  }

  protected getClientSignPayload(donation: UnsignedDonation): EncodedDonationSignPayload['clientSignPayload'] {
    return (
      (donation.successUrl ? donation.successUrl.href : '')
      + (donation.cancelUrl ? donation.cancelUrl.href : '')
    ) || null;
  }
}
