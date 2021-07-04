import { PaymentValidator } from '../../../src/helpers';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.targetAddress;

export default [
  [
    validPaymentBase,
    [PaymentValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: null
    },
    [PaymentValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: () => console.log('Target')
    },
    [PaymentValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: {}
    },
    [PaymentValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: ['KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x']
    },
    [PaymentValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: ''
    },
    [PaymentValidator.errors.targetAddressHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6xZ'
    },
    [PaymentValidator.errors.targetAddressHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6'
    },
    [PaymentValidator.errors.targetAddressHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: 'tz4aANkwuYKxB1XCyhB3CjMDDBQuPmNcBcCc'
    },
    [PaymentValidator.errors.targetAddressIsNotNetworkAddress]
  ],
  [
    {
      ...validPaymentBase,
      targetAddress: 'CT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
    },
    [PaymentValidator.errors.targetAddressIsNotNetworkAddress]
  ]
] as NegativeTestCases;
