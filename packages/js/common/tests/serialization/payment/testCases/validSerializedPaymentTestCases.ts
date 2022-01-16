/* eslint-disable max-len */
import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { SerializedPayment, Payment, PaymentType } from '../../../../src';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const validSerializedPaymentTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [serializedPayment: SerializedPayment, serializedPaymentBase64: string],
  expectedPayment: Payment
]> = [
    [
      'simple payment',
      [
        {
          i: 'eccda1db05c04ded9201f1b114b55efe',
          a: '384803.383202',
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          d: {
            order: {
              id: '0a6d2db181fa4ec7a7dbfb7b728201f6'
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
        'eyJpIjoiZWNjZGExZGIwNWMwNGRlZDkyMDFmMWIxMTRiNTVlZmUiLCJhIjoiMzg0ODAzLjM4MzIwMiIsInQiOiJLVDFKNXJYRlFNRzJpSGZBNEVocEtkRnlRVlFBVlk4d0hmNngiLCJkIjp7Im9yZGVyIjp7ImlkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsInMiOnsiayI6ImVkcGt0ZlFZUVhQUUIybWVjeXN6QnZYU1ZVejFzM1U3aWh0dGlKb21GZ3hZYlVIV0JqaTRkdSIsImMiOiJlZHNpZ3RzS0VENnF6dml0NXJuYkRUWUUxNG9VS3h3Um9aeVNvUHlrS2FSMkExSndiQzJiZm5GSnpSaGpmTm5OZ0Q0dWJUVHVydGdCaGRLakVkcW5oYUR5c3U3TWdDSlZROEYiLCJjbCI6ImVkc2lndGNGcDRQVkduVDNaTlROaVBvNEd5eVJLR1pCVWJhMUtud1Z5R3lHSmUzMkhjU3ZiR2FXU0trV3NkZFJhUUNlQ1R1RzNCbTN0SzhHZDhuWXdpQjlic25NeGRmUHVrWiJ9fQ',
      ],
      {
        type: PaymentType.Payment,
        id: 'eccda1db05c04ded9201f1b114b55efe',
        amount: new BigNumber('384803.383202'),
        targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
        data: {
          order: {
            id: '0a6d2db181fa4ec7a7dbfb7b728201f6'
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
        }
      }
    ],
    [
      'payment in FA 1.2',
      [
        {
          i: '2e743b62-2526-4630-9754-64bba8081e7d',
          a: '8383.383202283822832232',
          t: 'KT1Ey8EcgM1zSfdE75W9UGWpwQAr8wSuVaQe',
          as: {
            a: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
            d: 18
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          s: {
            k: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
            c: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
            cl: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
          }
        },
        'eyJpIjoiMmU3NDNiNjItMjUyNi00NjMwLTk3NTQtNjRiYmE4MDgxZTdkIiwiYSI6IjgzODMuMzgzMjAyMjgzODIyODMyMjMyIiwidCI6IktUMUV5OEVjZ00xelNmZEU3NVc5VUdXcHdRQXI4d1N1VmFRZSIsImFzIjp7ImEiOiJLVDFLOWdDUmdhTFJGS1RFcll0MXdWeEEzRnJiOUZqYXNqVFYiLCJkIjoxOH0sInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsInMiOnsiayI6ImVkcGt0ZlFZUVhQUUIybWVjeXN6QnZYU1ZVejFzM1U3aWh0dGlKb21GZ3hZYlVIV0JqaTRkdSIsImMiOiJlZHNpZ3U2elo1NFloaXFpM0pmd2lYUVVoTERMM1U2TWJOSFdpMXV3RDZTUmVVUGNzc3p1dzVNZDVQMlFHamp0bnd1TGVjekFCVlpzbW9iekRTbm04aWV4dUxIZ3hXcTRmbTMiLCJjbCI6ImVkc2lndHNLRUQ2cXp2aXQ1cm5iRFRZRTE0b1VLeHdSb1p5U29QeWtLYVIyQTFKd2JDMmJmbkZKelJoamZObk5nRDR1YlRUdXJ0Z0JoZEtqRWRxbmhhRHlzdTdNZ0NKVlE4RiJ9fQ',
      ],
      {
        type: PaymentType.Payment,
        id: '2e743b62-2526-4630-9754-64bba8081e7d',
        amount: new BigNumber('8383.383202283822832232'),
        targetAddress: 'KT1Ey8EcgM1zSfdE75W9UGWpwQAr8wSuVaQe',
        asset: {
          address: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
          decimals: 18,
          id: null
        },
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
        created: createdDate,
        expired: undefined,
        signature: {
          signingPublicKey: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
          contract: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
          client: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
        }
      }
    ],
    [
      'payment in FA 2',
      [
        {
          i: 'vRTlqz72EYR7elfyUMmsP',
          a: '398493943.32',
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          as: {
            a: 'KT1Q8EisfBH91DHTFY2Ee3qp6cXXV5RHPN6N',
            d: 2,
            i: 193,
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          s: {
            k: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
            c: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
            cl: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
          },
        },
        'eyJpIjoidlJUbHF6NzJFWVI3ZWxmeVVNbXNQIiwiYSI6IjM5ODQ5Mzk0My4zMiIsInQiOiJLVDFKNXJYRlFNRzJpSGZBNEVocEtkRnlRVlFBVlk4d0hmNngiLCJhcyI6eyJhIjoiS1QxUThFaXNmQkg5MURIVEZZMkVlM3FwNmNYWFY1UkhQTjZOIiwiZCI6MiwiaSI6MTkzfSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwicyI6eyJrIjoiZWRwa3RmUVlRWFBRQjJtZWN5c3pCdlhTVlV6MXMzVTdpaHR0aUpvbUZneFliVUhXQmppNGR1IiwiYyI6ImVkc2lndTZ6WjU0WWhpcWkzSmZ3aVhRVWhMREwzVTZNYk5IV2kxdXdENlNSZVVQY3NzenV3NU1kNVAyUUdqanRud3VMZWN6QUJWWnNtb2J6RFNubThpZXh1TEhneFdxNGZtMyIsImNsIjoiZWRzaWd0c0tFRDZxenZpdDVybmJEVFlFMTRvVUt4d1JvWnlTb1B5a0thUjJBMUp3YkMyYmZuRkp6UmhqZk5uTmdENHViVFR1cnRnQmhkS2pFZHFuaGFEeXN1N01nQ0pWUThGIn19',
      ],
      {
        type: PaymentType.Payment,
        id: 'vRTlqz72EYR7elfyUMmsP',
        amount: new BigNumber('398493943.32'),
        targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
        asset: {
          address: 'KT1Q8EisfBH91DHTFY2Ee3qp6cXXV5RHPN6N',
          decimals: 2,
          id: 193
        },
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
        created: createdDate,
        expired: undefined,
        signature: {
          signingPublicKey: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
          contract: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
          client: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
        }
      }
    ],
    [
      'expired payment',
      [
        {
          i: '4393438',
          a: '3939439430403',
          t: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
          d: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            itemsCount: 10,
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          s: {
            k: 'edpkvNZC2djpu424u2zWCmysv7yF1343tVW5pKSjQQziTUtPzJYxg6',
            c: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
            cl: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
          }
        },
        'eyJpIjoiNDM5MzQzOCIsImEiOiIzOTM5NDM5NDMwNDAzIiwidCI6IktUMUs5Z0NSZ2FMUkZLVEVyWXQxd1Z4QTNGcmI5Rmphc2pUViIsImQiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2IiwiaXRlbXNDb3VudCI6MTB9LCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdk5aQzJkanB1NDI0dTJ6V0NteXN2N3lGMTM0M3RWVzVwS1NqUVF6aVRVdFB6Sll4ZzYiLCJjIjoiZWRzaWd1NnpaNTRZaGlxaTNKZndpWFFVaExETDNVNk1iTkhXaTF1d0Q2U1JlVVBjc3N6dXc1TWQ1UDJRR2pqdG53dUxlY3pBQlZac21vYnpEU25tOGlleHVMSGd4V3E0Zm0zIiwiY2wiOiJlZHNpZ3RzS0VENnF6dml0NXJuYkRUWUUxNG9VS3h3Um9aeVNvUHlrS2FSMkExSndiQzJiZm5GSnpSaGpmTm5OZ0Q0dWJUVHVydGdCaGRLakVkcW5oYUR5c3U3TWdDSlZROEYifX0',
      ],
      {
        type: PaymentType.Payment,
        id: '4393438',
        amount: new BigNumber('3939439430403'),
        targetAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        data: {
          orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          itemsCount: 10,
        },
        asset: undefined,
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
        created: createdDate,
        expired: expiredDate,
        signature: {
          signingPublicKey: 'edpkvNZC2djpu424u2zWCmysv7yF1343tVW5pKSjQQziTUtPzJYxg6',
          contract: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
          client: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
        }
      }
    ],
    [
      'payment without optional urls',
      [
        {
          i: 'wU2QjHEQpk6nYCv555qZXQ==',
          a: '747.23834',
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          d: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
          },
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          s: {
            k: 'edpkvNZC2djpu424u2zWCmysv7yF1343tVW5pKSjQQziTUtPzJYxg6',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
          }
        },
        'eyJpIjoid1UyUWpIRVFwazZuWUN2NTU1cVpYUT09IiwiYSI6Ijc0Ny4yMzgzNCIsInQiOiJLVDFKNXJYRlFNRzJpSGZBNEVocEtkRnlRVlFBVlk4d0hmNngiLCJkIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9LCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdk5aQzJkanB1NDI0dTJ6V0NteXN2N3lGMTM0M3RWVzVwS1NqUVF6aVRVdFB6Sll4ZzYiLCJjIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIn19',
      ],
      {
        type: PaymentType.Payment,
        id: 'wU2QjHEQpk6nYCv555qZXQ==',
        targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
        amount: new BigNumber('747.23834'),
        data: {
          orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
        },
        asset: undefined,
        created: createdDate,
        expired: expiredDate,
        signature: {
          signingPublicKey: 'edpkvNZC2djpu424u2zWCmysv7yF1343tVW5pKSjQQziTUtPzJYxg6',
          contract: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
        }
      }
    ],
  ];

export default validSerializedPaymentTestCases;
