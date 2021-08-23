import { LegacyDonationDeserializer, NonSerializedDonationSlice } from '../../../src';
import negativeTestCases from './testCases/legacyDonationDeserializerNegativeTestCases';
import positiveTestCases from './testCases/legacyDonationDeserializerPositiveTestCases';

describe('Legacy Donation Deserializer', () => {
  const nonSerializedDonationSlice: NonSerializedDonationSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
  };

  let donationDeserializer: LegacyDonationDeserializer;

  beforeEach(() => {
    donationDeserializer = new LegacyDonationDeserializer();
  });

  test.each(positiveTestCases)('deserialize the valid donation: %p', (_, [, serializedDonationBase64], expectedDonationFactory) => {
    expect(donationDeserializer.deserialize(serializedDonationBase64, nonSerializedDonationSlice)).toEqual(expectedDonationFactory(nonSerializedDonationSlice));
  });

  test.each(negativeTestCases)('deserialize the invalid donation: %p', (_, [, serializedDonationBase64]) => {
    expect(donationDeserializer.deserialize(serializedDonationBase64, nonSerializedDonationSlice)).toBeNull();
  });
});
