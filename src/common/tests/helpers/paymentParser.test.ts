/* eslint-disable max-len */
import { BigNumber } from 'bignumber.js';

import { PaymentParser } from '../../src/helpers/paymentParser';
import { Payment } from '../../src/models/payment';
import { URL } from '../../src/native';

describe('Payment Parser', () => {
  const validCreatedDate = new Date('2021-06-26T00:37:03.930Z');
  const validExpiredDate = new Date('2021-06-26T00:57:03.930Z');

  let paymentParser: PaymentParser;

  beforeEach(() => {
    paymentParser = new PaymentParser();
  });

  const validRawPaymentTestCases: ReadonlyArray<[message: string | null, rawPayment: string, expectedPayment: Payment]> = [
    [
      'simple payment',
      'eyJhbW91bnQiOiIzODQ4MDMuMzgzMjAyIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS9wYXltZW50L3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3BheW1lbnQvY2FuY2VsIiwiY3JlYXRlZCI6IjIwMjEtMDYtMjZUMDA6Mzc6MDMuOTMwWiJ9',
      {
        amount: new BigNumber('384803.383202'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
          }
        },
        asset: undefined,
        successUrl: new URL('https://fastwaterbear.com/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/payment/cancel'),
        created: validCreatedDate,
        expired: undefined
      }
    ],
    [
      'payment in Kolibri USD',
      'eyJhbW91bnQiOiI4MzgzLjM4MzIwMjI4MzgyMjgzMjIzMiIsImRhdGEiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYXNzZXQiOiJLVDFLOWdDUmdhTFJGS1RFcll0MXdWeEEzRnJiOUZqYXNqVFYiLCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS9wYXltZW50L3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3BheW1lbnQvY2FuY2VsIiwiY3JlYXRlZCI6IjIwMjEtMDYtMjZUMDA6Mzc6MDMuOTMwWiJ9',
      {
        amount: new BigNumber('8383.383202283822832232'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
          }
        },
        asset: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        successUrl: new URL('https://fastwaterbear.com/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/payment/cancel'),
        created: validCreatedDate,
        expired: undefined
      }
    ],
    [
      'expired payment',
      'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS9wYXltZW50L3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3BheW1lbnQvY2FuY2VsIiwiY3JlYXRlZCI6IjIwMjEtMDYtMjZUMDA6Mzc6MDMuOTMwWiIsImV4cGlyZWQiOiIyMDIxLTA2LTI2VDAwOjU3OjAzLjkzMFoifQ==',
      {
        amount: new BigNumber('3939439430403'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          }
        },
        asset: undefined,
        successUrl: new URL('https://fastwaterbear.com/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/payment/cancel'),
        created: validCreatedDate,
        expired: validExpiredDate
      }
    ]
  ];

  test.each(validRawPaymentTestCases)('parsing the valid payment: %p', (_, rawPayment, expectedPayment) => {
    expect(paymentParser.parse(rawPayment)).toEqual(expectedPayment);
  });

  const invalidRawPaymentTestCases: ReadonlyArray<[message: string | null, rawPayment: string, invalidPayment: unknown]> = [
    [
      'payment without some required fields',
      'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3BheW1lbnQvY2FuY2VsIiwiZXhwaXJlZCI6IjIwMjEtMDYtMjZUMDA6NTc6MDMuOTMwWiJ9',
      {
        amount: new BigNumber('3939439430403'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          }
        },
        asset: undefined,
        // successUrl: ,
        cancelUrl: new URL('https://fastwaterbear.com/payment/cancel'),
        // created: ,
        expired: validExpiredDate
      },
    ],
    [
      'payment with excess fields',
      'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS9wYXltZW50L3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3BheW1lbnQvY2FuY2VsIiwiY3JlYXRlZCI6IjIwMjEtMDYtMjZUMDA6Mzc6MDMuOTMwWiIsImV4cGlyZWQiOiIyMDIxLTA2LTI2VDAwOjU3OjAzLjkzMFoiLCJzb21lRXh0cmFGaWVsZCI6MTAwfQ==',
      {
        amount: new BigNumber('3939439430403'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          }
        },
        asset: undefined,
        successUrl: new URL('https://fastwaterbear.com/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/payment/cancel'),
        created: validCreatedDate,
        expired: validExpiredDate,
        someExtraField: 100,
      }
    ],
    [
      'payment with invalid field types (amount)',
      'eyJhbW91bnQiOjM1MDM5LCJkYXRhIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sInN1Y2Nlc3NVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3BheW1lbnQvc3VjY2VzcyIsImNhbmNlbFVybCI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoiMjAyMS0wNi0yNlQwMDozNzowMy45MzBaIiwiZXhwaXJlZCI6IjIwMjEtMDYtMjZUMDA6NTc6MDMuOTMwWiJ9==',
      {
        amount: 35039,
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          }
        },
        asset: undefined,
        successUrl: new URL('https://fastwaterbear.com/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/payment/cancel'),
        created: validCreatedDate,
        expired: validExpiredDate
      }
    ],
    [
      'payment with invalid field types (success link)',
      'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiPHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0PiIsImNhbmNlbFVybCI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoiMjAyMS0wNi0yNlQwMDozNzowMy45MzBaIiwiZXhwaXJlZCI6IjIwMjEtMDYtMjZUMDA6NTc6MDMuOTMwWiJ9',
      {
        amount: new BigNumber('3939439430403'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          }
        },
        asset: undefined,
        successUrl: '<script>alert(1)</script>',
        cancelUrl: new URL('https://fastwaterbear.com/payment/cancel'),
        created: validCreatedDate,
        expired: validExpiredDate
      }
    ],
    [
      'payment with invalid field types (asset)',
      'eyJhbW91bnQiOiI4MzgzLjM4MzIwMjI4MzgyMjgzMjIzMiIsImRhdGEiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYXNzZXQiOnsidmFsdWUiOjMzMzMzMzN9LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS9wYXltZW50L3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3BheW1lbnQvY2FuY2VsIiwiY3JlYXRlZCI6IjIwMjEtMDYtMjZUMDA6Mzc6MDMuOTMwWiJ9',
      {
        amount: new BigNumber('8383.383202283822832232'),
        data: {
          public: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
          }
        },
        asset: { value: 3333333 },
        successUrl: new URL('https://fastwaterbear.com/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/payment/cancel'),
        created: validCreatedDate,
        expired: undefined
      }
    ],
    [
      'invalid payment object',
      'U29tZSB0ZXh0',
      'Some text'
    ]
  ];

  test.each(invalidRawPaymentTestCases)('parsing the invalid payment: %p', (_, rawPayment) => {
    expect(paymentParser.parse(rawPayment)).toBeNull();
  });
});
