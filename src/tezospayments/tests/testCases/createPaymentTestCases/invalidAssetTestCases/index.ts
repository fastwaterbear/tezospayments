import type { PaymentCreateParameters } from '../../../../src';
import { InvalidPaymentError } from '../../../../src/errors';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from '../validPaymentTestCases';
import invalidAssetAddressTestCases from './invalidAssetAddressTestCases';
import invalidAssetDecimalsTestCases from './invalidAssetDecimalsTestCases';
import invalidAssetIdTestCases from './invalidAssetIdTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { asset?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.asset;

export const invalidAssetTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = [
  [
    'Asset has an invalid type, function',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: () => 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    InvalidPaymentError
  ],
  [
    'Asset has an invalid type, array of strings',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    InvalidPaymentError
  ],
  [
    'Asset has an invalid type, string',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    InvalidPaymentError
  ],
  [
    'Asset has an invalid type, array of asset objects',
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      asset: [{
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
        decimals: 10,
        id: null
      }]
    },
    InvalidPaymentError
  ],
];

export default invalidAssetTestCases
  .concat(invalidAssetAddressTestCases)
  .concat(invalidAssetDecimalsTestCases)
  .concat(invalidAssetIdTestCases);

export {
  invalidAssetAddressTestCases,
  invalidAssetDecimalsTestCases,
  invalidAssetIdTestCases
};
