import { DonationValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';

export default [
  [
    undefined,
    [DonationValidator.errors.invalidDonationObject]
  ],
  [
    null,
    [DonationValidator.errors.invalidDonationObject]
  ],
  [
    'Test',
    [DonationValidator.errors.invalidDonationObject]
  ],
  [
    () => console.log('Test'),
    [DonationValidator.errors.invalidDonationObject]
  ],
  [
    [{}],
    [DonationValidator.errors.invalidDonationObject]
  ]
] as NegativeTestCases;
