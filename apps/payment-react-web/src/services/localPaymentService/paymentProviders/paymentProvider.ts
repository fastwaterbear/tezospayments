import { Payment, Donation } from '@tezospayments/common';

import { RawPaymentInfo } from '../urlRawPaymentInfoParser';

export interface PaymentProvider {
  isMatch(rawPaymentInfo: RawPaymentInfo): boolean;
  getPayment(rawPaymentInfo: RawPaymentInfo & { readonly operationType: 'payment' }): Payment | Promise<Payment>;
  getDonation(rawPaymentInfo: RawPaymentInfo & { readonly operationType: 'donation' }): Donation | Promise<Donation>;
}
