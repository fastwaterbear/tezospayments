import { NonIncludedDonationFields, DonationParser } from '../../../src/helpers';
import { PaymentType } from '../../../src/models/payment';
import { URL } from '../../../src/native';
import { invalidRawDonationTestCases, validRawDonationTestCases } from './donationCases';

describe('Donation Parser', () => {
  const nonIncludedFields: NonIncludedDonationFields = {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    urls: [
      { type: 'base64', url: new URL('https://payment.tezospayments.com/KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x/donation/#...') }
    ]
  };

  let donationParser: DonationParser;

  beforeEach(() => {
    donationParser = new DonationParser();
  });

  test.each(validRawDonationTestCases)('parsing the valid donation: %p', (_, [_rawDonation, serializedRawDonation], expectedDonationFactory) => {
    expect(donationParser.parse(serializedRawDonation, nonIncludedFields)).toEqual(expectedDonationFactory(nonIncludedFields));
  });

  test.each(invalidRawDonationTestCases)('parsing the invalid donation: %p', (_, [_rawDonation, serializedRawDonation]) => {
    expect(donationParser.parse(serializedRawDonation, nonIncludedFields)).toBeNull();
  });
});
