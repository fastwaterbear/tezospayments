import { BigNumber } from 'bignumber.js';

import { PaymentValidator } from '../../../src/helpers';
import type { NegativeTestCases } from './testCase';

export default [
  [
    {},
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      amount: 193
    },
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      amount: '383.343'
    },
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      amount: new BigNumber(NaN)
    },
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      amount: new BigNumber(Infinity)
    },
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      amount: new BigNumber(-1)
    },
    [PaymentValidator.errors.amountIsNegative]
  ]
] as NegativeTestCases;
