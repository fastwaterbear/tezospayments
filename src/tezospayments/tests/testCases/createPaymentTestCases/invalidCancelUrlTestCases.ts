import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { cancelUrl?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.cancelUrl;

export const invalidCancelUrlTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Cancel URL has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      cancelUrl: () => 'https://fastwaterbear.com/tezospayments/test/payment/cancel'
    },
    // We don't use the TypeError type, see details: https://github.com/facebook/jest/issues/2549
    'Invalid URL'
  ],
  [
    'Cancel URL has an invalid type, empty object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      cancelUrl: {}
    },
    'Invalid URL'
  ],
  [
    'Cancel URL is invalid, no scheme',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      cancelUrl: 'fastwaterbear.com/tezospayments/test/payment/cancel'
    },
    'Invalid URL'
  ],
  [
    'Cancel URL is invalid, no base URL',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      cancelUrl: '/tezospayments/test/payment/cancel'
    },
    'Invalid URL'
  ],
  [
    'Cancel URL is invalid, denied URL',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      // eslint-disable-next-line no-script-url
      cancelUrl: 'javascript:alert(111)'
    },
    InvalidPaymentError
  ]
];

export default invalidCancelUrlTestCases;
