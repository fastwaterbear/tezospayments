import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { created?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.asset;

export const invalidCreatedDateTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Created date has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      created: () => 1630410001000
    },
    InvalidPaymentError
  ],
  [
    'Created date has an invalid type, empty object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      created: {}
    },
    InvalidPaymentError
  ],
  [
    'Created date has an invalid type, array',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      created: [1630410001000]
    },
    InvalidPaymentError
  ],
  [
    'Created date is invalid, a value is equal to Infinity',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      created: Infinity
    },
    InvalidPaymentError
  ],
  [
    'Created date is invalid, a value is equal to an invalid date string',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      created: '2021-30-12T00:12:11.327Z'
    },
    InvalidPaymentError
  ]
];

export default invalidCreatedDateTestCases;
