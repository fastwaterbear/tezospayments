import { PaymentValidator } from '../../../src/helpers';
import type { NegativeTestCases } from './testCase';

export default [
  [
    undefined,
    [PaymentValidator.errors.invalidPaymentObject]
  ],
  [
    null,
    [PaymentValidator.errors.invalidPaymentObject]
  ],
  [
    'Test',
    [PaymentValidator.errors.invalidPaymentObject]
  ],
  [
    () => console.log('Test'),
    [PaymentValidator.errors.invalidPaymentObject]
  ],
  [
    [{}],
    [PaymentValidator.errors.invalidPaymentObject]
  ]
] as NegativeTestCases;
