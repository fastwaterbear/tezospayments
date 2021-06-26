import { Payment } from '@tezos-payments/common/dist/models/payment';

const errors = {
  invalidUrl: 'Invalid URL',
  invalidPayment: 'Invalid payment'
} as const;

export type ParsingOperationError = typeof errors[keyof typeof errors];

export class LocalPaymentService {
  async parseCurrentPayment(): Promise<Payment | ParsingOperationError> {
    const currentLocation = window.location;

    const paymentBase64 = currentLocation.hash.slice(1);
    if (!paymentBase64)
      return errors.invalidUrl;

    const segments = currentLocation.pathname.split('/').filter(Boolean) as readonly string[] as readonly [
      targetAddress: string,
      operationType: string
    ];

    if (segments.length !== 2)
      return errors.invalidUrl;

    return Payment.parse(paymentBase64, {
      targetAddress: segments[0],
      urls: [{ type: 'base64', url: new URL(window.location.href) }]
    }) ?? errors.invalidPayment;
  }
}
