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

const validAssetBase: Omit<PaymentAsset, 'id'> = {
  address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
  decimals: 5
};

export const invalidAssetTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Token Id is missed',
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
    'Token Id has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        id: () => 17
      }
    },
    InvalidPaymentError
  ],
  [
    'Token Id has an invalid type, object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        id: {}
      }
    },
    InvalidPaymentError
  ],
  [
    'Token Id has an invalid type, string',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        id: '11'
      }
    },
    InvalidPaymentError
  ],
  [
    'Token Id is NaN',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        id: NaN
      }
    },
    InvalidPaymentError
  ],
  [
    'Token Id is Infinity',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        id: Infinity
      }
    },
    InvalidPaymentError
  ],
  [
    'Token Id is negative',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        id: -3
      }
    },
    InvalidPaymentError
  ],
  [
    'Token Id isn\'t an integer',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        id: 1.5
      }
    },
    InvalidPaymentError
  ],
];

export default invalidAssetTestCases;
