import { DonationValidator } from '../../../../src/helpers';
import { URL } from 'url';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.cancelUrl;

export default [
  [
    {
      ...validDonationBase,
      cancelUrl: null
    },
    [DonationValidator.errors.invalidCancelUrl]
  ],
  [
    {
      ...validDonationBase,
      cancelUrl: () => console.log('cancelUrl')
    },
    [DonationValidator.errors.invalidCancelUrl]
  ],
  [
    {
      ...validDonationBase,
      cancelUrl: {}
    },
    [DonationValidator.errors.invalidCancelUrl]
  ],
  [
    {
      ...validDonationBase,
      cancelUrl: 'https://fastwaterbear.com/tezosdonations/test/donation/cancel'
    },
    [DonationValidator.errors.invalidCancelUrl]
  ],
  [
    {
      ...validDonationBase,
      cancelUrl: new URL('javascript:alert(111)')
    },
    [DonationValidator.errors.cancelUrlHasInvalidProtocol]
  ],
] as NegativeTestCases;
