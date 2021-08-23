import { DonationDeserializer, NonSerializedDonationSlice } from '../../../src';
import negativeTestCases from './testCases/donationDeserializerNegativeTestCases';
import positiveTestCases from './testCases/donationDeserializerPositiveTestCases';

describe('Donation Deserializer', () => {
  const nonSerializedDonationSlice: NonSerializedDonationSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
  };

  let donationDeserializer: DonationDeserializer;

  beforeEach(() => {
    donationDeserializer = new DonationDeserializer();
  });

  test.each(positiveTestCases)('deserialize the valid donation: %p', (_, [, serializedDonationBase64], expectedDonationFactory) => {
    expect(donationDeserializer.deserialize(serializedDonationBase64, nonSerializedDonationSlice)).toEqual(expectedDonationFactory(nonSerializedDonationSlice));
  });

  test.each(negativeTestCases)('deserialize the invalid donation: %p', (_, [, serializedDonationBase64]) => {
    expect(donationDeserializer.deserialize(serializedDonationBase64, nonSerializedDonationSlice)).toBeNull();
  });
});
