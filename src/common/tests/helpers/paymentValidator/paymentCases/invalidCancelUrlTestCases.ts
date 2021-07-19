import { PaymentValidator } from '../../../../src/helpers';
import { URL } from '../../../../src/native';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.cancelUrl;

export default [
  [
    {
      ...validPaymentBase,
      cancelUrl: null
    },
    [PaymentValidator.errors.invalidCancelUrl]
  ],
  [
    {
      ...validPaymentBase,
      cancelUrl: () => console.log('cancelUrl')
    },
    [PaymentValidator.errors.invalidCancelUrl]
  ],
  [
    {
      ...validPaymentBase,
      cancelUrl: {}
    },
    [PaymentValidator.errors.invalidCancelUrl]
  ],
  [
    {
      ...validPaymentBase,
      cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel'
    },
    [PaymentValidator.errors.invalidCancelUrl]
  ],
  [
    {
      ...validPaymentBase,
      cancelUrl: new URL('javascript:alert(111)')
    },
    [PaymentValidator.errors.cancelUrlHasInvalidProtocol]
  ],
] as NegativeTestCases;
