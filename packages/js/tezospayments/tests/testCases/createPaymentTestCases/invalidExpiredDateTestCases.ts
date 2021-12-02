import { PaymentValidator } from '@tezospayments/common';

import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { expired?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.asset;

export const invalidExpiredDateTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Expired date has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      expired: () => 1630410001000
    },
    InvalidPaymentError
  ],
  [
    'Expired date has an invalid type, empty object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      expired: {}
    },
    InvalidPaymentError
  ],
  [
    'Expired date has an invalid type, array',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      expired: [1630410001000]
    },
    InvalidPaymentError
  ],
  [
    'Expired date is invalid, a value is equal to Infinity',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      expired: Infinity
    },
    InvalidPaymentError
  ],
  [
    'Expired date is invalid, a value is equal to an invalid date string',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      expired: '2021-30-12T00:12:11.327Z'
    },
    InvalidPaymentError
  ],
  [
    'Expired date is invalid, a value is equal to an invalid date string',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      expired: '2021-30-12T00:12:11.327Z'
    },
    InvalidPaymentError
  ],
  [
    'Expired date is less than the created date',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      created: new Date('2021-09-01:17:00:30:049Z').getTime(),
      expired: new Date('2021-09-01:17:00:10:058Z').getTime(),
    },
    InvalidPaymentError
  ],
  [
    `Expired date is less than the minimum payment lifetime (${PaymentValidator.minimumPaymentLifetime / 1000} seconds)`,
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      created: new Date('2021-09-01:17:00:30:049Z').getTime(),
      expired: new Date('2021-09-01:17:00:30:049Z').getTime() + PaymentValidator.minimumPaymentLifetime - 1,
    },
    InvalidPaymentError
  ]
];

export default invalidExpiredDateTestCases;
