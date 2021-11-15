import type { DonationAsset } from '../../../../../src';
import { DonationValidator } from '../../../../../src/helpers';
import type { NegativeTestCases } from '../../testCase';
import validDonationTestCases from '../validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.desiredAsset;

const validAssetBase: Omit<DonationAsset, 'id'> = {
  address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
};

export default [
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase
      }
    },
    [DonationValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        id: {}
      }
    },
    [DonationValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        id: () => 7
      }
    },
    [DonationValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        id: '1'
      }
    },
    [DonationValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        id: NaN
      }
    },
    [DonationValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        id: Infinity
      }
    },
    [DonationValidator.errors.invalidAssetId]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        id: -10
      }
    },
    [DonationValidator.errors.assetIdIsNegative]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {
        ...validAssetBase,
        id: 10.10
      }
    },
    [DonationValidator.errors.assetIdIsNotInteger]
  ],
] as NegativeTestCases;
