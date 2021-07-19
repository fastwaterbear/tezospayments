/* eslint-disable max-len */
import { BigNumber } from 'bignumber.js';

import type { NonIncludedPaymentFields, RawPayment } from '../../../../src/helpers/paymentParser/paymentParser';
import type { Payment } from '../../../../src/models/payment';
import { URL } from '../../../../src/native';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const cases: ReadonlyArray<readonly [
  message: string | null,
  rawPayment: readonly [obj: RawPayment, serialized: string],
  expectedPaymentFactory: (nonIncludedPaymentFields: NonIncludedPaymentFields) => Payment
]> = [
    [
      'simple payment',
      [
        {
          amount: '384803.383202',
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          successUrl: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          created: createdDate,
        },
        'eyJhbW91bnQiOiIzODQ4MDMuMzgzMjAyIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoiMjAyMS0wNi0yNlQwMDozNzowMy45MzBaIn0=',
      ],
      nonIncludedFields => ({
        amount: new BigNumber('384803.383202'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
          }
        },
        asset: undefined,
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
        created: createdDate,
        expired: undefined,
        ...nonIncludedFields
      })
    ],
    [
      'payment in Kolibri USD',
      [
        {
          amount: '8383.383202283822832232',
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          asset: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
          successUrl: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          created: createdDate,
        },
        'eyJhbW91bnQiOiI4MzgzLjM4MzIwMjI4MzgyMjgzMjIzMiIsImRhdGEiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYXNzZXQiOiJLVDFLOWdDUmdhTFJGS1RFcll0MXdWeEEzRnJiOUZqYXNqVFYiLCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoiMjAyMS0wNi0yNlQwMDozNzowMy45MzBaIn0=',
      ],
      nonIncludedFields => ({
        amount: new BigNumber('8383.383202283822832232'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
          }
        },
        asset: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
        created: createdDate,
        expired: undefined,
        ...nonIncludedFields
      })
    ],
    [
      'expired payment',
      [
        {
          amount: '3939439430403',
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          successUrl: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          created: createdDate,
          expired: expiredDate
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoiMjAyMS0wNi0yNlQwMDozNzowMy45MzBaIiwiZXhwaXJlZCI6IjIwMjEtMDYtMjZUMDA6NTc6MDMuOTMwWiJ9',
      ],
      nonIncludedFields => ({
        amount: new BigNumber('3939439430403'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          }
        },
        asset: undefined,
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
        created: createdDate,
        expired: expiredDate,
        ...nonIncludedFields
      })
    ]
  ];

export default cases;
