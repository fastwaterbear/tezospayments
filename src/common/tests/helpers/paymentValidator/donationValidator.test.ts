import { DonationValidator } from '../../../src/helpers';
import { Donation } from '../../../src/models/payment';
import {
  invalidDataTestCases, invalidDesiredAmountTestCases, invalidDesiredAssetTestCases,
  invalidCancelUrlTestCases, invalidDonationObjectTestCases, invalidSuccessUrlTestCases,
  invalidTargetAddressTestCases, invalidTypeTestCases, validDonationTestCases
} from './donationCases';
import { NegativeTestCases } from './testCase';

describe('Donation Validator', () => {
  let donationValidator: DonationValidator;

  beforeEach(() => {
    donationValidator = new DonationValidator();
  });

  test.each(validDonationTestCases)('donation validation when a donation is valid [%p]', donation => {
    expect(donationValidator.validate(donation)).toBeUndefined();
  });

  const invalidDonationTestCases: NegativeTestCases = invalidDonationObjectTestCases
    .concat(invalidTypeTestCases)
    .concat(invalidDataTestCases)
    .concat(invalidDesiredAmountTestCases)
    .concat(invalidTargetAddressTestCases)
    .concat(invalidDesiredAssetTestCases)
    .concat(invalidSuccessUrlTestCases)
    .concat(invalidCancelUrlTestCases);

  test.each(invalidDonationTestCases)(
    'donation validation when a donation is invalid. Fail on the first error [%p]',
    (donation, failedValidationResults) => {
      expect(donationValidator.validate((donation as Donation))).toEqual(failedValidationResults);
    });
});
