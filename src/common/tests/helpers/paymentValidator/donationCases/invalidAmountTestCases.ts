import { BigNumber } from 'bignumber.js';

import { DonationValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.amount;

export default [
  [
    validDonationBase,
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      amount: 193
    },
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      amount: '383.343'
    },
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      amount: new BigNumber(NaN)
    },
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      amount: new BigNumber(Infinity)
    },
    [DonationValidator.errors.invalidAmount]
  ],
  [
    {
      ...validDonationBase,
      amount: new BigNumber(-1)
    },
    [DonationValidator.errors.amountIsNegative]
  ]
] as NegativeTestCases;
