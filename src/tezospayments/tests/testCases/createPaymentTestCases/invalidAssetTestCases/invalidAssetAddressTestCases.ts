import type { PaymentAsset, PaymentCreateParameters } from '../../../../src';
import { InvalidPaymentError } from '../../../../src/errors';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from '../validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { asset?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.asset;

const validAssetBase: Omit<PaymentAsset, 'address'> = {
  decimals: 17,
  id: 1
};

export const invalidAssetTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Asset address is missed',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset address has an invalid type, null',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: null
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset address has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: () => 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset address has an invalid type, object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: {}
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset address has an invalid type, array',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
      }
    },
    InvalidPaymentError
  ],

  [
    'Asset address is an empty string',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: ''
      }
    },
    InvalidPaymentError
  ],
  [
    'The length of the asset contract address is less than normal',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
      }
    },
    InvalidPaymentError
  ],
  [
    'The length of the asset contract address is more than normal',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
      }
    },
    InvalidPaymentError
  ],
  [
    'The asset contract address is an implicit account',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
      }
    },
    InvalidPaymentError
  ],
  [
    'The asset contract address has an invalid prefix',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        address: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
      }
    },
    InvalidPaymentError
  ]
];

export default invalidAssetTestCases;
