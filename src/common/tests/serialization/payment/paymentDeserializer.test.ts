import { PaymentDeserializer, NonSerializedPaymentSlice } from '../../../src';
import { validSerializedPaymentTestCases, invalidSerializedPaymentTestCases } from './testCases';

describe('Payment Deserializer', () => {
  const nonSerializedPaymentSlice: NonSerializedPaymentSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
  };

  let paymentDeserializer: PaymentDeserializer;

  beforeEach(() => {
    paymentDeserializer = new PaymentDeserializer();
  });

  test.each(validSerializedPaymentTestCases)('deserialize the valid payment: %p', (_, [, serializedPaymentBase64], expectedPaymentFactory) => {
    expect(paymentDeserializer.deserialize(serializedPaymentBase64, nonSerializedPaymentSlice)).toEqual(expectedPaymentFactory(nonSerializedPaymentSlice));
  });

  test.each(invalidSerializedPaymentTestCases)('deserialize the invalid payment: %p', (_, [, serializedPaymentBase64]) => {
    expect(paymentDeserializer.deserialize(serializedPaymentBase64, nonSerializedPaymentSlice)).toBeNull();
  });
});
