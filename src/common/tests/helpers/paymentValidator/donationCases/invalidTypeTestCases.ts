import { DonationValidator } from '../../../../src/helpers';
import { PaymentType } from '../../../../src/models/payment';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.type;

export default [
  [
    validDonationBase,
    [DonationValidator.errors.invalidType]
  ],
  [
    {
      ...validDonationBase,
      type: null
    },
    [DonationValidator.errors.invalidType]
  ],
  [
    {
      ...validDonationBase,
      type: 0
    },
    [DonationValidator.errors.invalidType]
  ],
  [
    {
      ...validDonationBase,
      type: PaymentType.Payment
    },
    [DonationValidator.errors.invalidType]
  ],
  [
    {
      ...validDonationBase,
      type: 30
    },
    [DonationValidator.errors.invalidType]
  ],
] as NegativeTestCases;
