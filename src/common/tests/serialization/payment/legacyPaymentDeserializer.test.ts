import { URL } from 'url';

import { LegacyPaymentSerializer, NonSerializedPaymentSlice } from '../../../src';
import negativeTestCases from './testCases/legacyPaymentDeserializerNegativeTestCases';
import positiveTestCases from './testCases/legacyPaymentDeserializerPositiveTestCases';

describe('Legacy Payment Deserializer', () => {
  const nonSerializedPaymentSlice: NonSerializedPaymentSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    urls: [
      { type: 'base64', url: new URL('https://payment.tezospayments.com/KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x/payment/#...') }
    ]
  };

  let paymentSerializer: LegacyPaymentSerializer;

  beforeEach(() => {
    paymentSerializer = new LegacyPaymentSerializer();
  });

  test.each(positiveTestCases)('deserialize the valid payment: %p', (_, [, serializedPaymentBase64], expectedPaymentFactory) => {
    expect(paymentSerializer.deserialize(serializedPaymentBase64, nonSerializedPaymentSlice)).toEqual(expectedPaymentFactory(nonSerializedPaymentSlice));
  });

  test.each(negativeTestCases)('deserialize the invalid payment: %p', (_, [, serializedPaymentBase64]) => {
    expect(paymentSerializer.deserialize(serializedPaymentBase64, nonSerializedPaymentSlice)).toBeNull();
  });
});
