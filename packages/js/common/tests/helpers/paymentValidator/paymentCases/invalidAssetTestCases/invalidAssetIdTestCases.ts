import type { PaymentAsset } from '../../../../../src';
import { PaymentValidator } from '../../../../../src/helpers';
import type { NegativeTestCases } from '../../testCase';
import validPaymentTestCases from '../validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.asset;

const validAssetBase: Omit<PaymentAsset, 'id'> = {
  address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
  decimals: 7
};

export default [
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase
      }
    },
    [PaymentValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        id: {}
      }
    },
    [PaymentValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        id: () => 7
      }
    },
    [PaymentValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        id: '1'
      }
    },
    [PaymentValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        id: NaN
      }
    },
    [PaymentValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        id: Infinity
      }
    },
    [PaymentValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        id: -10
      }
    },
    [PaymentValidator.errors.assetIdIsNegative]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        id: 10.10
      }
    },
    [PaymentValidator.errors.assetIdIsNotInteger]
  ],
] as NegativeTestCases;
