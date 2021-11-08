
import { Donation, EncodedDonationSignPayload } from '../../models';

export class DonationSignPayloadEncoder {
  encode(donation: Donation): EncodedDonationSignPayload {
    return {
      clientSignPayload: this.getClientSignPayload(donation)
    };
  }

  protected getClientSignPayload(donation: Donation): EncodedDonationSignPayload['clientSignPayload'] {
    return (
      (donation.successUrl ? donation.successUrl.href : '')
      + (donation.cancelUrl ? donation.cancelUrl.href : '')
    ) || null;
  }
}
