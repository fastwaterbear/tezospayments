import { NonIncludedPaymentFields, PaymentParser } from '../../../src/helpers';
import { PaymentType } from '../../../src/models/payment';
import { URL } from '../../../src/native';
import { invalidRawPaymentTestCases, validRawPaymentTestCases } from './paymentCases';

describe('Payment Parser', () => {
  const nonIncludedFields: NonIncludedPaymentFields = {
    type: PaymentType.Payment,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    urls: [
      { type: 'base64', url: new URL('https://payment.tezospayments.com/KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x/payment/#...') }
    ]
  };

  let paymentParser: PaymentParser;

  beforeEach(() => {
    paymentParser = new PaymentParser();
  });

  test.each(validRawPaymentTestCases)('parsing the valid payment: %p', (_, [_rawPayment, serializedRawPayment], expectedPaymentFactory) => {
    expect(paymentParser.parse(serializedRawPayment, nonIncludedFields)).toEqual(expectedPaymentFactory(nonIncludedFields));
  });

  test.each(invalidRawPaymentTestCases)('parsing the invalid payment: %p', (_, [_rawPayment, serializedRawPayment]) => {
    expect(paymentParser.parse(serializedRawPayment, nonIncludedFields)).toBeNull();
  });
});