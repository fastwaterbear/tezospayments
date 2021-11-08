export interface EncodedPaymentSignPayload {
  readonly contractSignPayload: string;
  readonly clientSignPayload: string | null;
}

export interface EncodedDonationSignPayload {
  readonly clientSignPayload: string | null;
}
