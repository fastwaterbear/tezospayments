import { Donation, Payment, PaymentType } from '../../models';
import type { URL } from '../../native';
import { converters, optimization } from '../../utils';
import type { EncodedDonationSignPayload, EncodedPaymentSignPayload, PaymentSignPayloadEncoder } from './paymentSignPayloadEncoder';

export class RawPaymentSignPayloadEncoder implements PaymentSignPayloadEncoder {
  encode(payment: Payment): EncodedPaymentSignPayload;
  encode(donation: Donation): EncodedDonationSignPayload;
  encode(paymentOrDonation: Payment | Donation): EncodedPaymentSignPayload | EncodedDonationSignPayload {
    return paymentOrDonation.type === PaymentType.Payment
      ? this.encodePayment(paymentOrDonation)
      : this.encodeDonation(paymentOrDonation);
  }

  protected encodePayment(payment: Payment): EncodedPaymentSignPayload {
    const contractSignPayload = payment.type
      // + payment.id
      + payment.targetAddress
      + payment.amount.toFormat(optimization.emptyObject)
      + (Payment.publicDataExists(payment) ? converters.objectToBytes(payment.data.public) : '')
      + (Payment.privateDataExists(payment) ? converters.objectToBytes(payment.data.private) : '')
      + (payment.asset || '')
      + (payment.created.getTime())
      + (payment.expired ? payment.expired.getTime() : '');

    const clientSignPayload = this.getClientSignPayload(payment);

    const encodedContractSignPayload = converters.stringToBytes(contractSignPayload);
    const encodedClientSignPayload = clientSignPayload !== null ? converters.stringToBytes(clientSignPayload) : null;

    return {
      contractSignPayload: encodedContractSignPayload,
      clientSignPayload: encodedClientSignPayload
    };
  }

  protected encodeDonation(donation: Donation): EncodedDonationSignPayload {
    const clientSignPayload = this.getClientSignPayload(donation);
    const encodedClientSignPayload = clientSignPayload !== null ? converters.stringToBytes(clientSignPayload) : null;

    return {
      clientSignPayload: encodedClientSignPayload
    };
  }

  private getClientSignPayload(payment: { successUrl?: URL; cancelUrl?: URL }) {
    return ((payment.successUrl ? payment.successUrl.href : '')
      + (payment.cancelUrl ? payment.cancelUrl.href : '')) || null;
  }
}
