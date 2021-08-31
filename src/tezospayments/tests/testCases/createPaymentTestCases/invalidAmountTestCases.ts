import { PaymentCreateParameters } from '../../../src';
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
    '',
    tezosPaymentsOptions,
    paymentCreateParametersBase,
    InvalidPaymentError
  ],
  [
    '',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: '0'
    },
    InvalidPaymentError
  ],
  [
    '',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: '383.343.30'
    },
    InvalidPaymentError
  ],
  [
    '',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: 'amount'
    },
    InvalidPaymentError
  ],
  [
    '',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: 'Infinity'
    },
    InvalidPaymentError
  ],
  [
    '',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: NaN
    },
    InvalidPaymentError
  ],
  [
    '',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: Infinity
    },
    InvalidPaymentError
  ],
  [
    '',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      amount: '-10'
    },
    InvalidPaymentError
  ]
];

export default invalidAmountTestCases;
