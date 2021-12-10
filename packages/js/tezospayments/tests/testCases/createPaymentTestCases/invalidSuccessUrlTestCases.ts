import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { successUrl?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.successUrl;

export const invalidSuccessUrlTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Success URL has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      successUrl: () => 'https://fastwaterbear.com/tezospayments/test/payment/success'
    },
    // We don't use the TypeError type, see details: https://github.com/facebook/jest/issues/2549
    'Invalid URL'
  ],
  [
    'Success URL has an invalid type, empty object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      successUrl: {}
    },
    'Invalid URL'
  ],
  [
    'Success URL is invalid, no scheme',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      successUrl: 'fastwaterbear.com/tezospayments/test/payment/success'
    },
    'Invalid URL'
  ],
  [
    'Success URL is invalid, no base URL',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      successUrl: '/tezospayments/test/payment/success'
    },
    'Invalid URL'
  ],
  [
    'Success URL is invalid, denied URL',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      // eslint-disable-next-line no-script-url
      successUrl: 'javascript:alert(111)'
    },
    InvalidPaymentError
  ]
];

export default invalidSuccessUrlTestCases;
