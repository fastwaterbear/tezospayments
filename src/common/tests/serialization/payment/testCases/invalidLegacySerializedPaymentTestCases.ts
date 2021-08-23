/* eslint-disable max-len */
import { LegacySerializedPayment } from '../../../../src';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const invalidLegacySerializedPaymentTestCases: ReadonlyArray<readonly [
  message: string | null,
  serializedPayment: readonly [serializedPayment: LegacySerializedPayment, serializedPaymentBase64: string]
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
          // created: ,
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          expired: expiredDate.getTime()
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImV4cGlyZWQiOjE2MjQ2NjkwMjM5MzB9',
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
          created: createdDate.getTime(),
          expired: expiredDate.getTime(),
          ...[...new Array(30)].reduce((obj, _, index) => {
            obj[`someExtraField${index}`] = index * 100;

            return obj;
          }, {})
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoxNjI0NjY3ODIzOTMwLCJleHBpcmVkIjoxNjI0NjY5MDIzOTMwLCJzb21lRXh0cmFGaWVsZDAiOjAsInNvbWVFeHRyYUZpZWxkMSI6MTAwLCJzb21lRXh0cmFGaWVsZDIiOjIwMCwic29tZUV4dHJhRmllbGQzIjozMDAsInNvbWVFeHRyYUZpZWxkNCI6NDAwLCJzb21lRXh0cmFGaWVsZDUiOjUwMCwic29tZUV4dHJhRmllbGQ2Ijo2MDAsInNvbWVFeHRyYUZpZWxkNyI6NzAwLCJzb21lRXh0cmFGaWVsZDgiOjgwMCwic29tZUV4dHJhRmllbGQ5Ijo5MDAsInNvbWVFeHRyYUZpZWxkMTAiOjEwMDAsInNvbWVFeHRyYUZpZWxkMTEiOjExMDAsInNvbWVFeHRyYUZpZWxkMTIiOjEyMDAsInNvbWVFeHRyYUZpZWxkMTMiOjEzMDAsInNvbWVFeHRyYUZpZWxkMTQiOjE0MDAsInNvbWVFeHRyYUZpZWxkMTUiOjE1MDAsInNvbWVFeHRyYUZpZWxkMTYiOjE2MDAsInNvbWVFeHRyYUZpZWxkMTciOjE3MDAsInNvbWVFeHRyYUZpZWxkMTgiOjE4MDAsInNvbWVFeHRyYUZpZWxkMTkiOjE5MDAsInNvbWVFeHRyYUZpZWxkMjAiOjIwMDAsInNvbWVFeHRyYUZpZWxkMjEiOjIxMDAsInNvbWVFeHRyYUZpZWxkMjIiOjIyMDAsInNvbWVFeHRyYUZpZWxkMjMiOjIzMDAsInNvbWVFeHRyYUZpZWxkMjQiOjI0MDAsInNvbWVFeHRyYUZpZWxkMjUiOjI1MDAsInNvbWVFeHRyYUZpZWxkMjYiOjI2MDAsInNvbWVFeHRyYUZpZWxkMjciOjI3MDAsInNvbWVFeHRyYUZpZWxkMjgiOjI4MDAsInNvbWVFeHRyYUZpZWxkMjkiOjI5MDB9',
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
          created: createdDate.getTime(),
          expired: expiredDate.getTime()
        },
        'eyJhbW91bnQiOjM1MDM5LCJkYXRhIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sInN1Y2Nlc3NVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImNyZWF0ZWQiOjE2MjQ2Njc4MjM5MzAsImV4cGlyZWQiOjE2MjQ2NjkwMjM5MzB9',
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
          created: createdDate.getTime(),
          expired: expiredDate.getTime()
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiZGF0YSI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdWNjZXNzVXJsIjoiPHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0PiIsImNhbmNlbFVybCI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiY3JlYXRlZCI6MTYyNDY2NzgyMzkzMCwiZXhwaXJlZCI6MTYyNDY2OTAyMzkzMH0=',
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
          created: createdDate.getTime()
        },
        'eyJhbW91bnQiOiI4MzgzLjM4MzIwMjI4MzgyMjgzMjIzMiIsImRhdGEiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYXNzZXQiOnsidmFsdWUiOjMzMzMzMzN9LCJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjcmVhdGVkIjoxNjI0NjY3ODIzOTMwfQ==',
      ]
    ],
    [
      'invalid payment object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [undefined as any, 'U29tZSB0ZXh0']
    ]
  ];

export default invalidLegacySerializedPaymentTestCases;
