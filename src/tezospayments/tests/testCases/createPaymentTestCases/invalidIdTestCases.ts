import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { id?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.id;

export const invalidIdTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Id has an invalid type, number',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      id: 4834939434
    },
    InvalidPaymentError
  ],
  [
    'Id has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      id: () => 'NqOzqsdqBQ_ajB0Hh2p7L'
    },
    InvalidPaymentError
  ],
  [
    'Id has an invalid type, empty object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      id: {}
    },
    InvalidPaymentError
  ],
  [
    'Id has an invalid type, array',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      id: ['NqOzqsdqBQ_ajB0Hh2p7L']
    },
    InvalidPaymentError
  ],
];

export default invalidIdTestCases;
