import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { amount: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.amount;

export const invalidAmountTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'The amount field is missed',
    tezosPaymentsOptions,
    paymentCreateParametersBase,
    InvalidPaymentError
  ],
  [
    'Amount is equal to 0',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: '0'
    },
    InvalidPaymentError
  ],
  [
    'Amount has an excess point',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: '383.343.30'
    },
    InvalidPaymentError
  ],
  [
    'The amount value is invalid',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: 'amount'
    },
    InvalidPaymentError
  ],
  [
    'The amount value is Infinity (string)',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: 'Infinity'
    },
    InvalidPaymentError
  ],
  [
    'The amount value is NaN',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: NaN
    },
    InvalidPaymentError
  ],
  [
    'The amount value is Infinity',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: Infinity
    },
    InvalidPaymentError
  ],
  [
    'Amount is negative',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: '-10'
    },
    InvalidPaymentError
  ]
];

export default invalidAmountTestCases;
