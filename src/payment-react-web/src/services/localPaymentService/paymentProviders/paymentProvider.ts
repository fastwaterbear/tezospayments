import { Payment, Donation } from '@tezospayments/common';

import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';
import { RawPaymentInfo } from '../urlRawPaymentInfoParser';

export interface PaymentProvider {
  isMatch(rawPaymentInfo: RawPaymentInfo): boolean;
  getPayment(rawPaymentInfo: RawPaymentInfo & { readonly operationType: 'payment' }): ServiceResult<Payment | Promise<Payment>, LocalPaymentServiceError>;
  getDonation(rawPaymentInfo: RawPaymentInfo & { readonly operationType: 'donation' }): ServiceResult<Donation | Promise<Donation>, LocalPaymentServiceError>;
}
