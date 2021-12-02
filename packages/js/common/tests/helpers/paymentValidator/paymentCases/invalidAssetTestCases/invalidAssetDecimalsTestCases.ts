import type { PaymentAsset } from '../../../../../src';
import { PaymentValidator } from '../../../../../src/helpers';
import type { NegativeTestCases } from '../../testCase';
import validPaymentTestCases from '../validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.asset;

const validAssetBase: Omit<PaymentAsset, 'decimals'> = {
  address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
  id: null
};

export default [
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase
      }
    },
    [PaymentValidator.errors.invalidAssetDecimals]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        decimals: null
      }
    },
    [PaymentValidator.errors.invalidAssetDecimals]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        decimals: {}
      }
    },
    [PaymentValidator.errors.invalidAssetDecimals]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        decimals: () => 7
      }
    },
    [PaymentValidator.errors.invalidAssetDecimals]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        decimals: '7'
      }
    },
    [PaymentValidator.errors.invalidAssetDecimals]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        decimals: NaN
      }
    },
    [PaymentValidator.errors.invalidAssetDecimals]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        decimals: Infinity
      }
    },
    [PaymentValidator.errors.invalidAssetDecimals]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        decimals: -10
      }
    },
    [PaymentValidator.errors.assetDecimalsNumberIsNegative]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        decimals: 10.10
      }
    },
    [PaymentValidator.errors.assetDecimalsNumberIsNotInteger]
  ],
] as NegativeTestCases;
