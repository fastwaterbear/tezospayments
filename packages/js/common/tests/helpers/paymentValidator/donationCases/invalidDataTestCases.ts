/* eslint-disable @typescript-eslint/no-explicit-any */
import { DonationValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.data;

export default [
  [
    {
      ...validDonationBase,
      data: null,
    },
    [DonationValidator.errors.invalidData]
  ],
  [
    {
      ...validDonationBase,
      data: 0,
    },
    [DonationValidator.errors.invalidData]
  ],
  [
    {
      ...validDonationBase,
      data: 'Test',
    },
    [DonationValidator.errors.invalidData]
  ],
  [
    {
      ...validDonationBase,
      data: () => console.log('public data'),
    },
    [DonationValidator.errors.invalidData]
  ]
] as NegativeTestCases;
