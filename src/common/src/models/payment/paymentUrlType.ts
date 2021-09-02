import { text } from '../../utils';

export enum PaymentUrlType {
  Base64 = 0
}

const encodedPaymentUrlTypeMap = new Map<PaymentUrlType, string>(
  Object.keys(PaymentUrlType)
    .filter(value => !isNaN(+value))
    .map(value => [+value, text.padStart(value, 2, '0')])
);

export const getEncodedPaymentUrlType = (paymentUrlType: PaymentUrlType) => encodedPaymentUrlTypeMap.get(paymentUrlType) || '';
