import { DonationValidator } from '../../../../../src/helpers';
import type { NegativeTestCases } from '../../testCase';
import validDonationTestCases from '../validDonationTestCases';
import invalidDesiredAssetAddressTestCases from './invalidDesiredAssetAddressTestCases';
import invalidDesiredAssetIdTestCases from './invalidDesiredAssetIdTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.desiredAsset;

export default ([
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
      desiredAsset: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    [DonationValidator.errors.invalidAsset]
  ],
  [
    {
      ...validDonationBase,
      desiredAsset: [{
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
        id: null
      }]
    },
    [DonationValidator.errors.invalidAsset]
  ],
] as NegativeTestCases)
  .concat(invalidDesiredAssetAddressTestCases)
  .concat(invalidDesiredAssetIdTestCases);
