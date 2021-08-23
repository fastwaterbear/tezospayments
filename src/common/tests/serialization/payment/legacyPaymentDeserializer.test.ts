import { LegacyPaymentDeserializer, NonSerializedPaymentSlice } from '../../../src';
import negativeTestCases from './testCases/legacyPaymentDeserializerNegativeTestCases';
import positiveTestCases from './testCases/legacyPaymentDeserializerPositiveTestCases';

describe('Legacy Payment Deserializer', () => {
  const nonSerializedPaymentSlice: NonSerializedPaymentSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
  };

  let paymentDeserializer: LegacyPaymentDeserializer;

  beforeEach(() => {
    paymentDeserializer = new LegacyPaymentDeserializer();
  });

  test.each(positiveTestCases)('deserialize the valid payment: %p', (_, [, serializedPaymentBase64], expectedPaymentFactory) => {
    expect(paymentDeserializer.deserialize(serializedPaymentBase64, nonSerializedPaymentSlice)).toEqual(expectedPaymentFactory(nonSerializedPaymentSlice));
  });

  test.each(negativeTestCases)('deserialize the invalid payment: %p', (_, [, serializedPaymentBase64]) => {
    expect(paymentDeserializer.deserialize(serializedPaymentBase64, nonSerializedPaymentSlice)).toBeNull();
  });
});
