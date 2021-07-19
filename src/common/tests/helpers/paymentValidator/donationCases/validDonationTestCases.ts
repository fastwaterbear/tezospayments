import { BigNumber } from 'bignumber.js';

import { Donation, PaymentType } from '../../../../src/models/payment';
import { URL } from '../../../../src/native';

export default [
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    amount: new BigNumber(384.48302),
    created: new Date('2021-07-04T00:17:23.043Z'),
    urls: []
  },
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    amount: new BigNumber(20238382),
    asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
    created: new Date('2021-07-05T10:21:01.111Z'),
    urls: []
  },
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    amount: new BigNumber(67.49),
    created: new Date('2021-07-05T10:21:01.111Z'),
    successUrl: new URL('https://fastwaterbear.com/tezosdonations/test/donation/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezosdonations/test/donation/cancel'),
    urls: []
  },
  {
    type: PaymentType.Donation,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    amount: new BigNumber(23267.41173),
    successUrl: new URL('https://fastwaterbear.com/tezosdonations/test/donation/success'),
    created: new Date('2021-07-05T10:21:01.111Z'),
    urls: []
  },
] as readonly Donation[];
