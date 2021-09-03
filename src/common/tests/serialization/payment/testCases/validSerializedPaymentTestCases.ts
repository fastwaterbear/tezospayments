/* eslint-disable max-len */
import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { SerializedPayment, NonSerializedPaymentSlice, Payment, PaymentType } from '../../../../src';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const validSerializedPaymentTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [serializedPayment: SerializedPayment, serializedPaymentBase64: string],
  paymentFactory: (nonSerializedPaymentSlice: NonSerializedPaymentSlice) => Payment
]> = [
    [
      'simple payment',
      [
        {
          i: 'eccda1db05c04ded9201f1b114b55efe',
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
        'eyJpIjoiZWNjZGExZGIwNWMwNGRlZDkyMDFmMWIxMTRiNTVlZmUiLCJhIjoiMzg0ODAzLjM4MzIwMiIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMH0',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        id: 'eccda1db05c04ded9201f1b114b55efe',
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
          i: '2e743b62-2526-4630-9754-64bba8081e7d',
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
        'eyJpIjoiMmU3NDNiNjItMjUyNi00NjMwLTk3NTQtNjRiYmE4MDgxZTdkIiwiYSI6IjgzODMuMzgzMjAyMjgzODIyODMyMjMyIiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJhcyI6IktUMUs5Z0NSZ2FMUkZLVEVyWXQxd1Z4QTNGcmI5Rmphc2pUViIsInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzB9',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        id: '2e743b62-2526-4630-9754-64bba8081e7d',
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
          i: '4393438',
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
        'eyJpIjoiNDM5MzQzOCIsImEiOiIzOTM5NDM5NDMwNDAzIiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwfQ',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        id: '4393438',
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
          i: 'wU2QjHEQpk6nYCv555qZXQ==',
          a: '747.23834',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          c: createdDate.getTime(),
          e: expiredDate.getTime()
        },
        'eyJpIjoid1UyUWpIRVFwazZuWUN2NTU1cVpYUT09IiwiYSI6Ijc0Ny4yMzgzNCIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYyI6MTYyNDY2NzgyMzkzMCwiZSI6MTYyNDY2OTAyMzkzMH0',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        id: 'wU2QjHEQpk6nYCv555qZXQ==',
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

export default validSerializedPaymentTestCases;
