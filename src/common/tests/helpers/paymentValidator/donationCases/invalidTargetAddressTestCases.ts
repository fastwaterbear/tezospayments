import { DonationValidator } from '../../../../src/helpers';
import type { NegativeTestCases } from '../testCase';
import validDonationTestCases from './validDonationTestCases';

const validDonationBase = { ...validDonationTestCases[0] };
delete validDonationBase.targetAddress;

export default [
  [
    validDonationBase,
    [DonationValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: null
    },
    [DonationValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: () => console.log('Target')
    },
    [DonationValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: {}
    },
    [DonationValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: ['KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x']
    },
    [DonationValidator.errors.invalidTargetAddress]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: ''
    },
    [DonationValidator.errors.targetAddressHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6xZ'
    },
    [DonationValidator.errors.targetAddressHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6'
    },
    [DonationValidator.errors.targetAddressHasInvalidLength]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: 'tz4aANkwuYKxB1XCyhB3CjMDDBQuPmNcBcCc'
    },
    [DonationValidator.errors.targetAddressIsNotNetworkAddress]
  ],
  [
    {
      ...validDonationBase,
      targetAddress: 'CT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
    },
    [DonationValidator.errors.targetAddressIsNotNetworkAddress]
  ]
] as NegativeTestCases;
