import { InvalidPaymentCreateParametersError, InvalidPaymentError } from '../../../src/errors';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

const tezosPaymentsOptions = validPaymentTestCases[0]![1];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const invalidPaymentParametersObjectTestCases: NegativeTestCases<any> = [
  [
    'The payment create parameters is undefined',
    tezosPaymentsOptions,
    undefined,
    InvalidPaymentCreateParametersError
  ],
  [
    'The payment create parameters is null',
    tezosPaymentsOptions,
    null,
    InvalidPaymentCreateParametersError
  ],
  [
    'The payment create parameters is empty',
    tezosPaymentsOptions,
    'Test',
    InvalidPaymentError
  ],
  [
    'The payment create parameters has an invalid type, function',
    tezosPaymentsOptions,
    () => console.log('Test'),
    InvalidPaymentError
  ],
  [
    'The payment create parameters has an invalid type, string',
    tezosPaymentsOptions,
    'Test',
    InvalidPaymentError
  ],
];

export default invalidPaymentParametersObjectTestCases;
