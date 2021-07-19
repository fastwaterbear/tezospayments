import { PaymentValidator } from '../../../src/helpers';
import { URL } from '../../../src/native';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.successUrl;

export default [
  [
    {
      ...validPaymentBase,
      successUrl: null
    },
    [PaymentValidator.errors.invalidSuccessUrl]
  ],
  [
    {
      ...validPaymentBase,
      successUrl: () => console.log('successUrl')
    },
    [PaymentValidator.errors.invalidSuccessUrl]
  ],
  [
    {
      ...validPaymentBase,
      successUrl: {}
    },
    [PaymentValidator.errors.invalidSuccessUrl]
  ],
  [
    {
      ...validPaymentBase,
      successUrl: 'https://fastwaterbear.com/tezospayments/test/payment/success'
    },
    [PaymentValidator.errors.invalidSuccessUrl]
  ],
  [
    {
      ...validPaymentBase,
      successUrl: new URL('javascript:alert(111)')
    },
    [PaymentValidator.errors.successUrlHasInvalidProtocol]
  ],
] as NegativeTestCases;
