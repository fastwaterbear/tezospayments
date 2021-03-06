import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { Donation, PaymentType } from '../../../../src/models/payment';

export default [
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    desiredAmount: new BigNumber(384.48302),
  },
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    data: {
      message: 'Hello!'
    }
  },
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    desiredAmount: new BigNumber(20238382),
    desiredAsset: {
      address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
      id: null
    }
  },
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    desiredAmount: new BigNumber(382.34345),
    desiredAsset: {
      address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
      id: 23
    }
  },
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    data: {
      text: 'Hello!',
      type: 'TypeX',
      numbers: [1, 43, 843]
    },
    amount: new BigNumber(67.49),
    successUrl: new URL('https://fastwaterbear.com/tezosdonations/test/donation/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezosdonations/test/donation/cancel'),
  },
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    desiredAmount: new BigNumber(23267.41173),
    successUrl: new URL('https://fastwaterbear.com/tezosdonations/test/donation/success'),
  },
] as readonly Donation[];
