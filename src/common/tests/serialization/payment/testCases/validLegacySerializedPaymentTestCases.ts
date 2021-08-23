/* eslint-disable max-len */
import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { LegacySerializedPayment, NonSerializedPaymentSlice, Payment, PaymentType } from '../../../../src';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const validLegacySerializedPaymentTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [serializedPayment: LegacySerializedPayment, serializedPaymentBase64: string],
  paymentFactory: (nonSerializedPaymentSlice: NonSerializedPaymentSlice) => Payment
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
          created: createdDate.getTime(),
        },
        'eyJhbW91bnQiOiIzODQ4MDMuMzgzMjAyIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoxNjI0NjY3ODIzOTMwfQ==',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
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
        ...nonSerializedSlice
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
          created: createdDate.getTime(),
        },
        'eyJhbW91bnQiOiI4MzgzLjM4MzIwMjI4MzgyMjgzMjIzMiIsImRhdGEiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYXNzZXQiOiJLVDFLOWdDUmdhTFJGS1RFcll0MXdWeEEzRnJiOUZqYXNqVFYiLCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoxNjI0NjY3ODIzOTMwfQ==',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
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
        ...nonSerializedSlice
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
          created: createdDate.getTime(),
          expired: expiredDate.getTime()
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoxNjI0NjY3ODIzOTMwLCJleHBpcmVkIjoxNjI0NjY5MDIzOTMwfQ==',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
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
        ...nonSerializedSlice
      })
    ],
    [
      'payment without optional urls',
      [
        {
          amount: '747.23834',
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          created: createdDate.getTime(),
          expired: expiredDate.getTime()
        },
        'eyJhbW91bnQiOiI3NDcuMjM4MzQiLCJkYXRhIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sImNyZWF0ZWQiOjE2MjQ2Njc4MjM5MzAsImV4cGlyZWQiOjE2MjQ2NjkwMjM5MzB9',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        amount: new BigNumber('747.23834'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          }
        },
        asset: undefined,
        created: createdDate,
        expired: expiredDate,
        ...nonSerializedSlice
      })
    ],
  ];

export default validLegacySerializedPaymentTestCases;
