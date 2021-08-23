/* eslint-disable @typescript-eslint/no-explicit-any */
import { DonationSerializer, NonSerializedDonationSlice } from '../../../src';
import { validSerializedDonationTestCases, invalidSerializedDonationTestCases } from './testCases';

describe('Donation Serializer', () => {
  const nonSerializedDonationSlice: NonSerializedDonationSlice = {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
  };

  let donationSerializer: DonationSerializer;

  beforeEach(() => {
    donationSerializer = new DonationSerializer();
  });

  test.each(validSerializedDonationTestCases)('serialize the valid donation: %p', (_, [, serializedDonationBase64], donationFactory) => {
    expect(donationSerializer.serialize(donationFactory(nonSerializedDonationSlice))).toEqual(serializedDonationBase64);
  });

  test.each(
    // We ignore a case with the invalid success url, as an invalid url can't be passed to the serializer:
    // the URL constructor will throw an exception before 
    invalidSerializedDonationTestCases.filter(([message]) => message !== 'donation with invalid field types (success link)')
  )('serialize the invalid donation: %p', (_, [serializedDonation]) => {
    const spy = jest.spyOn(donationSerializer as any, 'mapDonationToSerializedDonation')
      .mockImplementation(() => serializedDonation);

    expect(donationSerializer.serialize({} as any)).toBeNull();
    spy.mockRestore();
  });
});
