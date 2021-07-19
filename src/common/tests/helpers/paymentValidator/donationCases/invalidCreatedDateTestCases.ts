import { DonationValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.created;

export default [
  [
    validDonationBase,
    [DonationValidator.errors.invalidCreatedDate]
  ],
  [
    {
      ...validDonationBase,
      created: null
    },
    [DonationValidator.errors.invalidCreatedDate]
  ],
  [
    {
      ...validDonationBase,
      created: () => console.log('created date')
    },
    [DonationValidator.errors.invalidCreatedDate]
  ],
  [
    {
      ...validDonationBase,
      created: {}
    },
    [DonationValidator.errors.invalidCreatedDate]
  ],
  [
    {
      ...validDonationBase,
      created: '2021-07-05T00:12:11.327Z'
    },
    [DonationValidator.errors.invalidCreatedDate]
  ]
] as NegativeTestCases;
