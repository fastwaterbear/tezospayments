/* eslint-disable max-len */
import { SerializedPayment } from '../../../../src';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const paymentDeserializerNegativeTestCases: ReadonlyArray<readonly [
  message: string | null,
  serializedPayment: readonly [serializedPayment: SerializedPayment, serializedPaymentBase64: string]
]> = [
    [
      'payment without some required fields',
      [
        {
          a: '3939439430403',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          // c: ,
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          e: expiredDate.getTime()
        },
        'eyJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImUiOjE2MjQ2NjkwMjM5MzB9',
      ]
    ],
    [
      'payment with excess fields (a fields count is greater than the maximum)',
      [
        {
          a: '3939439430403',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          ...[...new Array(30)].reduce((obj, _, index) => {
            obj[`e_f_${index}`] = index * 100;

            return obj;
          }, {})
        },
        'eyJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwiZSI6MTYyNDY2OTAyMzkzMCwiZV9mXzAiOjAsImVfZl8xIjoxMDAsImVfZl8yIjoyMDAsImVfZl8zIjozMDAsImVfZl80Ijo0MDAsImVfZl81Ijo1MDAsImVfZl82Ijo2MDAsImVfZl83Ijo3MDAsImVfZl84Ijo4MDAsImVfZl85Ijo5MDAsImVfZl8xMCI6MTAwMCwiZV9mXzExIjoxMTAwLCJlX2ZfMTIiOjEyMDAsImVfZl8xMyI6MTMwMCwiZV9mXzE0IjoxNDAwLCJlX2ZfMTUiOjE1MDAsImVfZl8xNiI6MTYwMCwiZV9mXzE3IjoxNzAwLCJlX2ZfMTgiOjE4MDAsImVfZl8xOSI6MTkwMCwiZV9mXzIwIjoyMDAwLCJlX2ZfMjEiOjIxMDAsImVfZl8yMiI6MjIwMCwiZV9mXzIzIjoyMzAwLCJlX2ZfMjQiOjI0MDAsImVfZl8yNSI6MjUwMCwiZV9mXzI2IjoyNjAwLCJlX2ZfMjciOjI3MDAsImVfZl8yOCI6MjgwMCwiZV9mXzI5IjoyOTAwfQ==',
      ]
    ],
    [
      'payment with invalid field types (amount)',
      [
        {
          a: 35039,
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime()
        },
        'eyJhIjozNTAzOSwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwfQ==',
      ],
    ],
    [
      'payment with invalid field types (success link)',
      [
        {
          a: '3939439430403',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          su: '<script>alert(1)</script>',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime()
        },
        'eyJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiI8c2NyaXB0PmFsZXJ0KDEpPC9zY3JpcHQ+IiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsImUiOjE2MjQ2NjkwMjM5MzB9',
      ]
    ],
    [
      'payment with invalid field types (asset)',
      [
        {
          a: '8383.383202283822832232',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          as: { value: 3333333 },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime()
        },
        'eyJhIjoiODM4My4zODMyMDIyODM4MjI4MzIyMzIiLCJkIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sImFzIjp7InZhbHVlIjozMzMzMzMzfSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMH0=',
      ]
    ],
    [
      'invalid payment object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [undefined as any, 'U29tZSB0ZXh0']
    ]
  ];

export default paymentDeserializerNegativeTestCases;
