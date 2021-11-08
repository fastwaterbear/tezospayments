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
          s: {
            k: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
            c: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
            cl: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
          },
        },
        'eyJpIjoiZWNjZGExZGIwNWMwNGRlZDkyMDFmMWIxMTRiNTVlZmUiLCJhIjoiMzg0ODAzLjM4MzIwMiIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwicyI6eyJrIjoiZWRwa3RmUVlRWFBRQjJtZWN5c3pCdlhTVlV6MXMzVTdpaHR0aUpvbUZneFliVUhXQmppNGR1IiwiYyI6ImVkc2lndHNLRUQ2cXp2aXQ1cm5iRFRZRTE0b1VLeHdSb1p5U29QeWtLYVIyQTFKd2JDMmJmbkZKelJoamZObk5nRDR1YlRUdXJ0Z0JoZEtqRWRxbmhhRHlzdTdNZ0NKVlE4RiIsImNsIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIn19',
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
        signature: {
          signingPublicKey: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
          contract: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
          client: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
        },
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
          s: {
            k: 'edskS1tWqiZtLi7XjfQnNv3SoVXkzhWVdh8uXWQhC2wW9nELzzxZc59Zs8gnTtEYaZNNVfeqoCCxX2SvkSGKMv58CTHsjFPSfr',
            c: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
            cl: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
          }
        },
        'eyJpIjoiMmU3NDNiNjItMjUyNi00NjMwLTk3NTQtNjRiYmE4MDgxZTdkIiwiYSI6IjgzODMuMzgzMjAyMjgzODIyODMyMjMyIiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJhcyI6IktUMUs5Z0NSZ2FMUkZLVEVyWXQxd1Z4QTNGcmI5Rmphc2pUViIsInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsInMiOnsiayI6ImVkc2tTMXRXcWladExpN1hqZlFuTnYzU29WWGt6aFdWZGg4dVhXUWhDMndXOW5FTHp6eFpjNTlaczhnblR0RVlhWk5OVmZlcW9DQ3hYMlN2a1NHS012NThDVEhzakZQU2ZyIiwiYyI6ImVkc2lndTZ6WjU0WWhpcWkzSmZ3aVhRVWhMREwzVTZNYk5IV2kxdXdENlNSZVVQY3NzenV3NU1kNVAyUUdqanRud3VMZWN6QUJWWnNtb2J6RFNubThpZXh1TEhneFdxNGZtMyIsImNsIjoiZWRzaWd0c0tFRDZxenZpdDVybmJEVFlFMTRvVUt4d1JvWnlTb1B5a0thUjJBMUp3YkMyYmZuRkp6UmhqZk5uTmdENHViVFR1cnRnQmhkS2pFZHFuaGFEeXN1N01nQ0pWUThGIn19',
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
        signature: {
          signingPublicKey: 'edskS1tWqiZtLi7XjfQnNv3SoVXkzhWVdh8uXWQhC2wW9nELzzxZc59Zs8gnTtEYaZNNVfeqoCCxX2SvkSGKMv58CTHsjFPSfr',
          contract: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
          client: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
        },
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
          e: expiredDate.getTime(),
          s: {
            k: 'edskS1tWqiZtLi7XjfQnNv3SoVXkzhWVdh8uXWQhC2wW9nELzzxZc59Zs8gnTtEYaZNNVfeqoCCxX2SvkSGKMv58CTHsjFPSfr',
            c: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
            cl: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
          }
        },
        'eyJpIjoiNDM5MzQzOCIsImEiOiIzOTM5NDM5NDMwNDAzIiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHNrUzF0V3FpWnRMaTdYamZRbk52M1NvVlhremhXVmRoOHVYV1FoQzJ3VzluRUx6enhaYzU5WnM4Z25UdEVZYVpOTlZmZXFvQ0N4WDJTdmtTR0tNdjU4Q1RIc2pGUFNmciIsImMiOiJlZHNpZ3U2elo1NFloaXFpM0pmd2lYUVVoTERMM1U2TWJOSFdpMXV3RDZTUmVVUGNzc3p1dzVNZDVQMlFHamp0bnd1TGVjekFCVlpzbW9iekRTbm04aWV4dUxIZ3hXcTRmbTMiLCJjbCI6ImVkc2lndHNLRUQ2cXp2aXQ1cm5iRFRZRTE0b1VLeHdSb1p5U29QeWtLYVIyQTFKd2JDMmJmbkZKelJoamZObk5nRDR1YlRUdXJ0Z0JoZEtqRWRxbmhhRHlzdTdNZ0NKVlE4RiJ9fQ',
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
        signature: {
          signingPublicKey: 'edskS1tWqiZtLi7XjfQnNv3SoVXkzhWVdh8uXWQhC2wW9nELzzxZc59Zs8gnTtEYaZNNVfeqoCCxX2SvkSGKMv58CTHsjFPSfr',
          contract: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
          client: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
        },
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
          e: expiredDate.getTime(),
          s: {
            k: 'edskRvH8WRyuVQve1XgV11wXWsU2dPgARqJEi9TRkV9jGWDN54tyXarWE9kJtaD5GEFHZN1B5wc25PLV6wYH2AW7riHeou3HNe',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
          }
        },
        'eyJpIjoid1UyUWpIRVFwazZuWUN2NTU1cVpYUT09IiwiYSI6Ijc0Ny4yMzgzNCIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYyI6MTYyNDY2NzgyMzkzMCwiZSI6MTYyNDY2OTAyMzkzMCwicyI6eyJrIjoiZWRza1J2SDhXUnl1VlF2ZTFYZ1YxMXdYV3NVMmRQZ0FScUpFaTlUUmtWOWpHV0RONTR0eVhhcldFOWtKdGFENUdFRkhaTjFCNXdjMjVQTFY2d1lIMkFXN3JpSGVvdTNITmUiLCJjIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIn19',
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
        signature: {
          signingPublicKey: 'edskRvH8WRyuVQve1XgV11wXWsU2dPgARqJEi9TRkV9jGWDN54tyXarWE9kJtaD5GEFHZN1B5wc25PLV6wYH2AW7riHeou3HNe',
          contract: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
        },
        ...nonSerializedSlice
      })
    ],
  ];

export default validSerializedPaymentTestCases;
