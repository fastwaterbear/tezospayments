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
  }
] as readonly Payment[];
