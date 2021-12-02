import { PaymentValidator } from '../../../../src/helpers';
import { PaymentType } from '../../../../src/models/payment';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.type;

export default [
  [
    validPaymentBase,
    [PaymentValidator.errors.invalidType]
  ],
  [
    {
      ...validPaymentBase,
      type: null
    },
    [PaymentValidator.errors.invalidType]
  ],
  [
    {
      ...validPaymentBase,
      type: 0
    },
    [PaymentValidator.errors.invalidType]
  ],
  [
    {
      ...validPaymentBase,
      type: PaymentType.Donation
    },
    [PaymentValidator.errors.invalidType]
  ],
  [
    {
      ...validPaymentBase,
      type: 30
    },
    [PaymentValidator.errors.invalidType]
  ],
] as NegativeTestCases;
