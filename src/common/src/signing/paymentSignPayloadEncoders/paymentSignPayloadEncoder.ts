import type { Donation, Payment } from '../../models';

export interface EncodedPaymentSignPayload {
  readonly contractSignPayload: string;
  readonly clientSignPayload: string | null;
}

export interface EncodedDonationSignPayload {
  readonly clientSignPayload: string | null;
}

export interface PaymentSignPayloadEncoder {
  encode(payment: Payment): EncodedPaymentSignPayload;
  encode(donation: Donation): EncodedDonationSignPayload;
}
