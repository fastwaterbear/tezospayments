import { PaymentValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.expired;

export default [
  [
    {
      ...validPaymentBase,
      expired: null
    },
    [PaymentValidator.errors.invalidExpiredDate]
  ],
  [
    {
      ...validPaymentBase,
      expired: () => console.log('expired date')
    },
    [PaymentValidator.errors.invalidExpiredDate]
  ],
  [
    {
      ...validPaymentBase,
      expired: {}
    },
    [PaymentValidator.errors.invalidExpiredDate]
  ],
  [
    {
      ...validPaymentBase,
      expired: '2021-07-05T20:18:11.332Z'
    },
    [PaymentValidator.errors.invalidExpiredDate]
  ],
  [
    {
      ...validPaymentBase,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expired: new Date(validPaymentBase.created!.getTime() + PaymentValidator.minimumPaymentLifetime - 1)
    },
    [PaymentValidator.errors.paymentLifetimeIsShort]
  ]
] as NegativeTestCases;
