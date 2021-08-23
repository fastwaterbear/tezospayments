import { LegacyPaymentDeserializer, NonSerializedPaymentSlice } from '../../../src';
import { validLegacySerializedPaymentTestCases, invalidLegacySerializedPaymentTestCases } from './testCases';

describe('Legacy Payment Deserializer', () => {
  const nonSerializedPaymentSlice: NonSerializedPaymentSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
  };

  let paymentDeserializer: LegacyPaymentDeserializer;

  beforeEach(() => {
    paymentDeserializer = new LegacyPaymentDeserializer();
  });

  test.each(validLegacySerializedPaymentTestCases)('deserialize the valid payment: %p', (_, [, serializedPaymentBase64], expectedPaymentFactory) => {
    expect(paymentDeserializer.deserialize(serializedPaymentBase64, nonSerializedPaymentSlice)).toEqual(expectedPaymentFactory(nonSerializedPaymentSlice));
  });

  test.each(invalidLegacySerializedPaymentTestCases)('deserialize the invalid payment: %p', (_, [, serializedPaymentBase64]) => {
    expect(paymentDeserializer.deserialize(serializedPaymentBase64, nonSerializedPaymentSlice)).toBeNull();
  });
});
