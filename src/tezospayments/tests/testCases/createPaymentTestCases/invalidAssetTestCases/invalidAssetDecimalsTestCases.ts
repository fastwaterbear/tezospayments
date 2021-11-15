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

const validAssetBase: Omit<PaymentAsset, 'decimals'> = {
  address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
  id: null
};

export const invalidAssetTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Asset number of decimals is missed',
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
    'Asset number of decimals has an invalid type, null',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        decimals: null
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset number of decimals has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        decimals: () => 17
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset number of decimals has an invalid type, object',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        decimals: {}
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset number of decimals has an invalid type, string',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        decimals: '11'
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset number of decimals is NaN',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        decimals: NaN
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset number of decimals is Infinity',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        decimals: Infinity
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset number of decimals is negative',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        decimals: -3
      }
    },
    InvalidPaymentError
  ],
  [
    'Asset number of decimals isn\'t an integer',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: {
        ...validAssetBase,
        decimals: 1.5
      }
    },
    InvalidPaymentError
  ],
];

export default invalidAssetTestCases;
