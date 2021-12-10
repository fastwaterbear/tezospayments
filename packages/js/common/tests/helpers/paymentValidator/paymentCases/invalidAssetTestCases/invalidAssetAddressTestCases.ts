import type { PaymentAsset } from '../../../../../src';
import { PaymentValidator } from '../../../../../src/helpers';
import type { NegativeTestCases } from '../../testCase';
import validPaymentTestCases from '../validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.asset;

const validAssetBase: Omit<PaymentAsset, 'address'> = {
  decimals: 17,
  id: 1
};

export default [
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase
      }
    },
    [PaymentValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: null
      }
    },
    [PaymentValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: () => console.log('Asset')
      }
    },
    [PaymentValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: {}
      }
    },
    [PaymentValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
      }
    },
    [PaymentValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: ''
      }
    },
    [PaymentValidator.errors.assetAddressHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
      }
    },
    [PaymentValidator.errors.assetAddressHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
      }
    },
    [PaymentValidator.errors.assetAddressHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
      }
    },
    [PaymentValidator.errors.assetAddressIsNotContractAddress]
  ],
  [
    {
      ...validPaymentBase,
      asset: {
        ...validAssetBase,
        address: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
      }
    },
    [PaymentValidator.errors.assetAddressIsNotContractAddress]
  ]
] as NegativeTestCases;
