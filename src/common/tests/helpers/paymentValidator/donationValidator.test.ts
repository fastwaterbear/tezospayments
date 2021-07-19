import { DonationValidator } from '../../../src/helpers';
import { Donation } from '../../../src/models/payment';
import {
  invalidAmountTestCases, invalidAssetTestCases, invalidCancelUrlTestCases, invalidCreatedDateTestCases,
  invalidDonationObjectTestCases, invalidSuccessUrlTestCases, invalidTargetAddressTestCases,
  invalidTypeTestCases, validDonationTestCases
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
    .concat(invalidAmountTestCases)
    .concat(invalidTargetAddressTestCases)
    .concat(invalidAssetTestCases)
    .concat(invalidSuccessUrlTestCases)
    .concat(invalidCancelUrlTestCases)
    .concat(invalidCreatedDateTestCases);

  test.each(invalidDonationTestCases)(
    'donation validation when a donation is invalid. Fail on the first error [%p]',
    (donation, failedValidationResults) => {
      expect(donationValidator.validate((donation as Donation))).toEqual(failedValidationResults);
    });
});
