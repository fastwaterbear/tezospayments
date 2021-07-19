import { DonationValidator } from '../../../../src/helpers';
import { URL } from '../../../../src/native';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.successUrl;

export default [
  [
    {
      ...validDonationBase,
      successUrl: null
    },
    [DonationValidator.errors.invalidSuccessUrl]
  ],
  [
    {
      ...validDonationBase,
      successUrl: () => console.log('successUrl')
    },
    [DonationValidator.errors.invalidSuccessUrl]
  ],
  [
    {
      ...validDonationBase,
      successUrl: {}
    },
    [DonationValidator.errors.invalidSuccessUrl]
  ],
  [
    {
      ...validDonationBase,
      successUrl: 'https://fastwaterbear.com/tezosdonations/test/donation/success'
    },
    [DonationValidator.errors.invalidSuccessUrl]
  ],
  [
    {
      ...validDonationBase,
      successUrl: new URL('javascript:alert(111)')
    },
    [DonationValidator.errors.successUrlHasInvalidProtocol]
  ],
] as NegativeTestCases;
