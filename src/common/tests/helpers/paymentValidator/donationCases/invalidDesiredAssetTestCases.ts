import { DonationValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.desiredAsset;

export default [
  [
    {
      ...validDonationBase,
      desiredAsset: null
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: () => console.log('Asset')
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: {}
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: ''
    },
    [DonationValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
    },
    [DonationValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
    },
    [DonationValidator.errors.assetHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
    },
    [DonationValidator.errors.assetIsNotContractAddress]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    [DonationValidator.errors.assetIsNotContractAddress]
  ]
] as NegativeTestCases;
