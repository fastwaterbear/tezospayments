import BigNumber from 'bignumber.js';

import { PaymentValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.amount;

export default [
  [
    validPaymentBase,
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      ...validPaymentBase,
      amount: 193
    },
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      ...validPaymentBase,
      amount: '383.343'
    },
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      ...validPaymentBase,
      amount: new BigNumber(NaN)
    },
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      ...validPaymentBase,
      amount: new BigNumber(Infinity)
    },
    [PaymentValidator.errors.invalidAmount]
  ],
  [
    {
      ...validPaymentBase,
      amount: new BigNumber(-1)
    },
    [PaymentValidator.errors.amountIsNegative]
  ]
] as NegativeTestCases;
