import { Payment, Donation } from '@tezospayments/common';

import { errors } from '../errors';
import { RawPaymentInfo } from '../urlRawPaymentInfoParser';
import { PaymentProvider } from './paymentProvider';

export class SerializedPaymentBase64Provider implements PaymentProvider {
  isMatch(_rawPaymentInfo: RawPaymentInfo): boolean {
    return true;
  }

  getPayment(rawPaymentInfo: RawPaymentInfo & { readonly operationType: 'payment'; }): Payment | Promise<Payment> {
    const serializedPayment = rawPaymentInfo.serializedPayment.substr(2);
    const payment = Payment.deserialize(serializedPayment);

    if (!payment || Payment.validate(payment))
      throw new Error(errors.invalidPayment);

    return payment;
  }

  getDonation(rawPaymentInfo: RawPaymentInfo & { readonly operationType: 'donation'; }): Donation | Promise<Donation> {
    const serializedDonation = rawPaymentInfo.serializedDonation?.substr(2) || '';
    const donation = Donation.deserialize(
      serializedDonation,
      {
        targetAddress: rawPaymentInfo.targetAddress
      }
    );

    if (!donation || Donation.validate(donation))
      throw new Error(errors.invalidDonation);

    return donation;
  }
}
