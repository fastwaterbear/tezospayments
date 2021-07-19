/* eslint-disable max-len */
import type { RawPayment } from '../../../src/helpers/paymentParser/paymentParser';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const cases: ReadonlyArray<readonly [
  message: string | null,
  rawPayment: readonly [obj: RawPayment, serialized: string]
]> = [
    [
      'payment without some required fields',
      [
        {
          amount: '3939439430403',
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          // successUrl: ,
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          // created: ,
          expired: expiredDate
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImV4cGlyZWQiOiIyMDIxLTA2LTI2VDAwOjU3OjAzLjkzMFoifQ==',
      ]
    ],
    [
      'payment with excess fields (a fields count is greater than the maximum)',
      [
        {
          amount: '3939439430403',
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          successUrl: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          created: createdDate,
          expired: expiredDate,
          ...[...new Array(30)].reduce((obj, _, index) => {
            obj[`someExtraField${index}`] = index * 100;

            return obj;
          }, {})
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoiMjAyMS0wNi0yNlQwMDozNzowMy45MzBaIiwiZXhwaXJlZCI6IjIwMjEtMDYtMjZUMDA6NTc6MDMuOTMwWiIsInNvbWVFeHRyYUZpZWxkMCI6MCwic29tZUV4dHJhRmllbGQxIjoxMDAsInNvbWVFeHRyYUZpZWxkMiI6MjAwLCJzb21lRXh0cmFGaWVsZDMiOjMwMCwic29tZUV4dHJhRmllbGQ0Ijo0MDAsInNvbWVFeHRyYUZpZWxkNSI6NTAwLCJzb21lRXh0cmFGaWVsZDYiOjYwMCwic29tZUV4dHJhRmllbGQ3Ijo3MDAsInNvbWVFeHRyYUZpZWxkOCI6ODAwLCJzb21lRXh0cmFGaWVsZDkiOjkwMCwic29tZUV4dHJhRmllbGQxMCI6MTAwMCwic29tZUV4dHJhRmllbGQxMSI6MTEwMCwic29tZUV4dHJhRmllbGQxMiI6MTIwMCwic29tZUV4dHJhRmllbGQxMyI6MTMwMCwic29tZUV4dHJhRmllbGQxNCI6MTQwMCwic29tZUV4dHJhRmllbGQxNSI6MTUwMCwic29tZUV4dHJhRmllbGQxNiI6MTYwMCwic29tZUV4dHJhRmllbGQxNyI6MTcwMCwic29tZUV4dHJhRmllbGQxOCI6MTgwMCwic29tZUV4dHJhRmllbGQxOSI6MTkwMCwic29tZUV4dHJhRmllbGQyMCI6MjAwMCwic29tZUV4dHJhRmllbGQyMSI6MjEwMCwic29tZUV4dHJhRmllbGQyMiI6MjIwMCwic29tZUV4dHJhRmllbGQyMyI6MjMwMCwic29tZUV4dHJhRmllbGQyNCI6MjQwMCwic29tZUV4dHJhRmllbGQyNSI6MjUwMCwic29tZUV4dHJhRmllbGQyNiI6MjYwMCwic29tZUV4dHJhRmllbGQyNyI6MjcwMCwic29tZUV4dHJhRmllbGQyOCI6MjgwMCwic29tZUV4dHJhRmllbGQyOSI6MjkwMH0=',
      ]
    ],
    [
      'payment with invalid field types (amount)',
      [
        {
          amount: 35039,
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          successUrl: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          created: createdDate,
          expired: expiredDate
        },
        'eyJhbW91bnQiOjM1MDM5LCJkYXRhIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sInN1Y2Nlc3NVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImNyZWF0ZWQiOiIyMDIxLTA2LTI2VDAwOjM3OjAzLjkzMFoiLCJleHBpcmVkIjoiMjAyMS0wNi0yNlQwMDo1NzowMy45MzBaIn0=',
      ],
    ],
    [
      'payment with invalid field types (success link)',
      [
        {
          amount: '3939439430403',
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          successUrl: '<script>alert(1)</script>',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          created: createdDate,
          expired: expiredDate
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiPHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0PiIsImNhbmNlbFVybCI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiY3JlYXRlZCI6IjIwMjEtMDYtMjZUMDA6Mzc6MDMuOTMwWiIsImV4cGlyZWQiOiIyMDIxLTA2LTI2VDAwOjU3OjAzLjkzMFoifQ==',
      ]
    ],
    [
      'payment with invalid field types (asset)',
      [
        {
          amount: '8383.383202283822832232',
          data: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          asset: { value: 3333333 },
          successUrl: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          created: createdDate
        },
        'eyJhbW91bnQiOiI4MzgzLjM4MzIwMjI4MzgyMjgzMjIzMiIsImRhdGEiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYXNzZXQiOnsidmFsdWUiOjMzMzMzMzN9LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoiMjAyMS0wNi0yNlQwMDozNzowMy45MzBaIn0=',
      ]
    ],
    [
      'invalid payment object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [undefined as any, 'U29tZSB0ZXh0']
    ]
  ];

export default cases;
