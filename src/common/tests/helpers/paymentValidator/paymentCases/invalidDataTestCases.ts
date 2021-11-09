/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.data;

export default [
  [
    {
      ...validPaymentBase,
      data: null,
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: 0,
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: 'Test',
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: () => console.log('public data'),
    },
    [PaymentValidator.errors.invalidData]
  ]
] as NegativeTestCases;
