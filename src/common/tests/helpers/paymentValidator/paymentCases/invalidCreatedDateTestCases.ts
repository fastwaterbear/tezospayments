import { PaymentValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.created;

export default [
  [
    validPaymentBase,
    [PaymentValidator.errors.invalidCreatedDate]
  ],
  [
    {
      ...validPaymentBase,
      created: null
    },
    [PaymentValidator.errors.invalidCreatedDate]
  ],
  [
    {
      ...validPaymentBase,
      created: () => console.log('created date')
    },
    [PaymentValidator.errors.invalidCreatedDate]
  ],
  [
    {
      ...validPaymentBase,
      created: {}
    },
    [PaymentValidator.errors.invalidCreatedDate]
  ],
  [
    {
      ...validPaymentBase,
      created: '2021-07-05T00:12:11.327Z'
    },
    [PaymentValidator.errors.invalidCreatedDate]
  ]
] as NegativeTestCases;
