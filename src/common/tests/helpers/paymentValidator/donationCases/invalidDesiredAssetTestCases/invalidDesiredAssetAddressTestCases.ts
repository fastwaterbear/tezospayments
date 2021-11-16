import type { DonationAsset } from '../../../../../src';
import { DonationValidator } from '../../../../../src/helpers';
import type { NegativeTestCases } from '../../testCase';
import validDonationTestCases from '../validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.desiredAsset;

const validAssetBase: Omit<DonationAsset, 'address'> = {
  id: 1
};

export default [
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase
      }
    },
    [DonationValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: null
      }
    },
    [DonationValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: () => console.log('Asset')
      }
    },
    [DonationValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: {}
      }
    },
    [DonationValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
      }
    },
    [DonationValidator.errors.invalidAssetAddress]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: ''
      }
    },
    [DonationValidator.errors.assetAddressHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
      }
    },
    [DonationValidator.errors.assetAddressHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
      }
    },
    [DonationValidator.errors.assetAddressHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
      }
    },
    [DonationValidator.errors.assetAddressIsNotContractAddress]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        address: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
      }
    },
    [DonationValidator.errors.assetAddressIsNotContractAddress]
  ]
] as NegativeTestCases;
