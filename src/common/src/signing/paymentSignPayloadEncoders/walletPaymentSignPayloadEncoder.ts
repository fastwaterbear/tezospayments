import type { Donation, Payment } from '../../models';
import { text } from '../../utils';
import constants from './constants';
import type { EncodedDonationSignPayload, EncodedPaymentSignPayload } from './paymentSignPayloadEncoder';
import { RawPaymentSignPayloadEncoder } from './rawPaymentSignPayloadEncoder';

export class WalletPaymentSignPayloadEncoder extends RawPaymentSignPayloadEncoder {
  protected encodePayment(payment: Payment): EncodedPaymentSignPayload {
    const { contractSignPayload, clientSignPayload } = super.encodePayment(payment);

    return {
      contractSignPayload: this.prepareEncodedSignPayload(contractSignPayload),
      clientSignPayload: clientSignPayload !== null ? this.prepareEncodedSignPayload(clientSignPayload) : null
    };
  }

  protected encodeDonation(donation: Donation): EncodedDonationSignPayload {
    const encodedDonationSignPayload = super.encodeDonation(donation);

    return {
      clientSignPayload: encodedDonationSignPayload.clientSignPayload !== null
        ? this.prepareEncodedSignPayload(encodedDonationSignPayload.clientSignPayload)
        : null
    };
  }

  private prepareEncodedSignPayload(encodedSignPayload: string) {
    const encodedSignPayloadWithWalletPrefix = constants.walletPaymentSignPayloadPrefix + encodedSignPayload;

    return constants.michelineSigningTypePrefix
      + text.padStart(encodedSignPayloadWithWalletPrefix.length.toString(), 8, '0') + encodedSignPayloadWithWalletPrefix;
  }
}
