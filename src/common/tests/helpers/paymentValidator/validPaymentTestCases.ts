import { BigNumber } from 'bignumber.js';

import type { Payment } from '../../../src/models/payment';
import { URL } from '../../../src/native';

export default [
  {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    amount: new BigNumber(384.48302),
    data: {
      public: {
        orderId: 'o:38849203'
      }
    },
    successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
    created: new Date('2021-07-04T00:17:23.043Z'),
    urls: []
  },
  {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    amount: new BigNumber(20238382),
    data: {
      public: {
        orderId: 'da242e2b-6a2b-4066-bad1-2479fa947c54'
      }
    },
    asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
    successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
    created: new Date('2021-07-05T10:21:01.111Z'),
    urls: []
  },
  {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    amount: new BigNumber(67.49),
    data: {
      public: {
        orderId: '67fedcf8-3bfc-458f-aa66-4635adafb669'
      },
      private: {
        userId: 'd1d85902651040598bca27e8a76c4c0c'
      }
    },
    successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
    created: new Date('2021-07-05T10:21:01.111Z'),
    expired: new Date('2021-07-05T10:41:01.111Z'),
    urls: []
  },
  {
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    amount: new BigNumber(23267.41173),
    data: {
      public: {
        orderId: '67fedcf8-3bfc-458f-aa66-4635adafb669'
      }
    },
    successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
    created: new Date('2021-07-05T10:21:01.111Z'),
    expired: new Date('2021-07-05T10:41:01.111Z'),
    urls: []
  },
] as readonly Payment[];
