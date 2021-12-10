export const errors = {
  invalidUrl: 'Invalid URL',
  invalidPayment: 'Invalid payment',
  invalidDonation: 'Invalid donation'
} as const;

export type LocalPaymentServiceError = string;
