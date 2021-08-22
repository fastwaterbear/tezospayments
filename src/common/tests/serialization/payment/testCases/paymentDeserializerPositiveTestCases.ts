/* eslint-disable max-len */
import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { SerializedPayment, NonSerializedPaymentSlice, Payment, PaymentType } from '../../../../src';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const paymentDeserializerPositiveTestCases: ReadonlyArray<readonly [
  message: string | null,
  serializedPayment: readonly [serializedPayment: SerializedPayment, serializedPaymentBase64: string],
  expectedPaymentFactory: (nonSerializedPaymentSlice: NonSerializedPaymentSlice) => Payment
]> = [
    [
      'simple payment',
      [
        {
          a: '384803.383202',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
        },
        'eyJhIjoiMzg0ODAzLjM4MzIwMiIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMH0=',
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
          a: '8383.383202283822832232',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          as: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
        },
        'eyJhIjoiODM4My4zODMyMDIyODM4MjI4MzIyMzIiLCJkIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sImFzIjoiS1QxSzlnQ1JnYUxSRktURXJZdDF3VnhBM0ZyYjlGamFzalRWIiwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMH0=',
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
          a: '3939439430403',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime()
        },
        'eyJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwiZSI6MTYyNDY2OTAyMzkzMH0=',
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
          a: '747.23834',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          c: createdDate.getTime(),
          e: expiredDate.getTime()
        },
        'eyJhIjoiNzQ3LjIzODM0IiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwfQ==',
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

export default paymentDeserializerPositiveTestCases;
