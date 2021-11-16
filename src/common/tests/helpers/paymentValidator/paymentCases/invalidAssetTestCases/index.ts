import { PaymentValidator } from '../../../../../src/helpers';
import type { NegativeTestCases } from '../../testCase';
import validPaymentTestCases from '../validPaymentTestCases';
import invalidAssetAddressTestCases from './invalidAssetAddressTestCases';
import invalidAssetDecimalsTestCases from './invalidAssetDecimalsTestCases';
import invalidAssetIdTestCases from './invalidAssetIdTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.asset;

export default ([
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
      asset: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    [PaymentValidator.errors.invalidAsset]
  ],
  [
    {
      ...validPaymentBase,
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    [PaymentValidator.errors.invalidAsset]
  ],
  [
    {
      ...validPaymentBase,
      asset: [{
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
        decimals: 10,
        id: null
      }]
    },
    [PaymentValidator.errors.invalidAsset]
  ]
] as NegativeTestCases)
  .concat(invalidAssetAddressTestCases)
  .concat(invalidAssetDecimalsTestCases)
  .concat(invalidAssetIdTestCases);
