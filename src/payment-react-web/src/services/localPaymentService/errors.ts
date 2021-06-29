export const errors = {
  invalidUrl: 'Invalid URL',
  invalidPayment: 'Invalid payment'
} as const;

export type LocalPaymentServiceError = string;
