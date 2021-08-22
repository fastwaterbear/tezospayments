import { URL } from 'url';

import { LegacyDonationSerializer, NonSerializedDonationSlice } from '../../../src';
import negativeTestCases from './testCases/legacyDonationDeserializerNegativeTestCases';
import positiveTestCases from './testCases/legacyDonationDeserializerPositiveTestCases';

describe('Legacy Donation Deserializer', () => {
  const nonSerializedDonationSlice: NonSerializedDonationSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    urls: [
      { type: 'base64', url: new URL('https://payment.tezospayments.com/KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x/donation/#...') }
    ]
  };

  let donationSerializer: LegacyDonationSerializer;

  beforeEach(() => {
    donationSerializer = new LegacyDonationSerializer();
  });

  test.each(positiveTestCases)('deserialize the valid donation: %p', (_, [, serializedDonationBase64], expectedDonationFactory) => {
    expect(donationSerializer.deserialize(serializedDonationBase64, nonSerializedDonationSlice)).toEqual(expectedDonationFactory(nonSerializedDonationSlice));
  });

  test.each(negativeTestCases)('deserialize the invalid donation: %p', (_, [, serializedDonationBase64]) => {
    expect(donationSerializer.deserialize(serializedDonationBase64, nonSerializedDonationSlice)).toBeNull();
  });
});
