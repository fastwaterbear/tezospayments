import BigNumber from 'bignumber.js';

import { DonationValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.desiredAmount;

export default [
  [
    {
      ...validDonationBase,
      desiredAmount: 193
    },
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      desiredAmount: '383.343'
    },
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      desiredAmount: new BigNumber(NaN)
    },
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      desiredAmount: new BigNumber(Infinity)
    },
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      desiredAmount: new BigNumber(0)
    },
    [DonationValidator.errors.amountIsNonPositive]
  ],
  [
    {
      ...validDonationBase,
      desiredAmount: new BigNumber(-1)
    },
    [DonationValidator.errors.amountIsNonPositive]
  ]
] as NegativeTestCases;
