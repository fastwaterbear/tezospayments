import { DonationDeserializer, NonSerializedDonationSlice } from '../../../src';
import { validSerializedDonationTestCases, invalidSerializedDonationTestCases } from './testCases';

describe('Donation Deserializer', () => {
  const nonSerializedDonationSlice: NonSerializedDonationSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
  };

  let donationDeserializer: DonationDeserializer;

  beforeEach(() => {
    donationDeserializer = new DonationDeserializer();
  });

  test.each(validSerializedDonationTestCases)('deserialize the valid donation: %p', (_, [, serializedDonationBase64], expectedDonationFactory) => {
    expect(donationDeserializer.deserialize(serializedDonationBase64, nonSerializedDonationSlice)).toEqual(expectedDonationFactory(nonSerializedDonationSlice));
  });

  test.each(invalidSerializedDonationTestCases)('deserialize the invalid donation: %p', (_, [, serializedDonationBase64]) => {
    expect(donationDeserializer.deserialize(serializedDonationBase64, nonSerializedDonationSlice)).toBeNull();
  });
});
