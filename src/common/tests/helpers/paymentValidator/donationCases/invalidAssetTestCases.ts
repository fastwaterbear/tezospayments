import { DonationValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.asset;

export default [
  [
    {
      ...validDonationBase,
      asset: null
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      asset: () => console.log('Asset')
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      asset: {}
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      asset: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      asset: ''
    },
    [DonationValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
    },
    [DonationValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
    },
    [DonationValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      asset: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
    },
    [DonationValidator.errors.assetIsNotContractAddress]
  ],
  [
    {
      ...validDonationBase,
      asset: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    [DonationValidator.errors.assetIsNotContractAddress]
  ]
] as NegativeTestCases;
