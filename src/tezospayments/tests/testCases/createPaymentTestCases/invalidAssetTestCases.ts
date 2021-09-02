import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { asset?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.asset;

export const invalidAssetTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Asset has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: () => 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    InvalidPaymentError
  ],
  [
    'Asset has an invalid type, empty object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {}
    },
    InvalidPaymentError
  ],
  [
    'Asset has an invalid type, array',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    InvalidPaymentError
  ],
  [
    'The length of the asset contract address is less than normal',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
    },
    InvalidPaymentError
  ],
  [
    'The length of the asset contract address is more than normal',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
    },
    InvalidPaymentError
  ],
  [
    'The asset contract address is an implicit account',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
    },
    InvalidPaymentError
  ],
  [
    'The asset contract address has an invalid prefix',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    InvalidPaymentError
  ]
];

export default invalidAssetTestCases;
