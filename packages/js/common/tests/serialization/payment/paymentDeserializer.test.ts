import { PaymentDeserializer } from '../../../src';
import { validSerializedPaymentTestCases, invalidSerializedPaymentTestCases } from './testCases';

describe('Payment Deserializer', () => {
  let paymentDeserializer: PaymentDeserializer;

  beforeEach(() => {
    paymentDeserializer = new PaymentDeserializer();
  });

  test.each(validSerializedPaymentTestCases)('deserialize the valid payment: %p', (_, [, serializedPaymentBase64], expectedPayment) => {
    expect(paymentDeserializer.deserialize(serializedPaymentBase64)).toEqual(expectedPayment);
  });

  test.each(invalidSerializedPaymentTestCases)('deserialize the invalid payment: %p', (_, [, serializedPaymentBase64]) => {
    expect(paymentDeserializer.deserialize(serializedPaymentBase64)).toBeNull();
  });
});
