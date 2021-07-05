import { PaymentValidator } from '../../../src/helpers';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.asset;

export default [
  [
    {
      ...validPaymentBase,
      asset: null
    },
    [PaymentValidator.errors.invalidAsset]
  ],
  [
    {
      ...validPaymentBase,
      asset: () => console.log('Asset')
    },
    [PaymentValidator.errors.invalidAsset]
  ],
  [
    {
      ...validPaymentBase,
      asset: {}
    },
    [PaymentValidator.errors.invalidAsset]
  ],
  [
    {
      ...validPaymentBase,
      asset: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    [PaymentValidator.errors.invalidAsset]
  ],
  [
    {
      ...validPaymentBase,
      asset: ''
    },
    [PaymentValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
    },
    [PaymentValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
    },
    [PaymentValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validPaymentBase,
      asset: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
    },
    [PaymentValidator.errors.assetIsNotContractAddress]
  ],
  [
    {
      ...validPaymentBase,
      asset: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    [PaymentValidator.errors.assetIsNotContractAddress]
  ]
] as NegativeTestCases;
