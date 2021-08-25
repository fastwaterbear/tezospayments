/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentSerializer, NonSerializedPaymentSlice } from '../../../src';
import { validSerializedPaymentTestCases, invalidSerializedPaymentTestCases } from './testCases';

describe('Payment Serializer', () => {
  const nonSerializedPaymentSlice: NonSerializedPaymentSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
  };

  let paymentSerializer: PaymentSerializer;

  beforeEach(() => {
    paymentSerializer = new PaymentSerializer();
  });

  test.each(validSerializedPaymentTestCases)('serialize the valid payment: %p', (_, [, serializedPaymentBase64], paymentFactory) => {
    expect(paymentSerializer.serialize(paymentFactory(nonSerializedPaymentSlice))).toEqual(serializedPaymentBase64);
  });

  test.each(
    // We ignore a case with the invalid success url, as an invalid url can't be passed to the serializer:
    // the URL constructor will throw an exception before 
    invalidSerializedPaymentTestCases.filter(([message]) => message !== 'payment with invalid field types (success link)')
  )('serialize the invalid payment: %p', (_, [serializedPayment]) => {
    const spy = jest.spyOn(paymentSerializer as any, 'mapPaymentToSerializedPayment')
      .mockImplementation(() => serializedPayment);

    expect(paymentSerializer.serialize({} as any)).toBeNull();
    spy.mockRestore();
  });
});
