export const errors = {
  invalidUrl: 'Invalid URL',
  invalidPayment: 'Invalid payment',
  invalidDonation: 'Invalid donation',
  invalidContract: 'Invalid service contract',
  actionAborterByUser: 'The action was aborted by the user.'
} as const;

export type LocalPaymentServiceError = string;