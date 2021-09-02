import { PaymentValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.id;

export default [
  [
    validPaymentBase,
    [PaymentValidator.errors.invalidId]
  ],
  [
    {
      ...validPaymentBase,
      id: null
    },
    [PaymentValidator.errors.invalidId]
  ],
  [
    {
      ...validPaymentBase,
      id: () => console.log('fe1347f3a57f415f8c1a9879f7a4a634')
    },
    [PaymentValidator.errors.invalidId]
  ],
  [
    {
      ...validPaymentBase,
      id: {}
    },
    [PaymentValidator.errors.invalidId]
  ],
  [
    {
      ...validPaymentBase,
      id: ['fe1347f3a57f415f8c1a9879f7a4a634']
    },
    [PaymentValidator.errors.invalidId]
  ],
  [
    {
      ...validPaymentBase,
      id: 34838439
    },
    [PaymentValidator.errors.invalidId]
  ],
  [
    {
      ...validPaymentBase,
      id: ''
    },
    [PaymentValidator.errors.emptyId]
  ],
] as NegativeTestCases;
