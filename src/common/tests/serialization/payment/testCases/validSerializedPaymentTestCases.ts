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
        'eyJpIjoiZWNjZGExZGIwNWMwNGRlZDkyMDFmMWIxMTRiNTVlZmUiLCJhIjoiMzg0ODAzLjM4MzIwMiIsImQiOnsib3JkZXIiOnsiaWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwicyI6eyJrIjoiZWRwa3RmUVlRWFBRQjJtZWN5c3pCdlhTVlV6MXMzVTdpaHR0aUpvbUZneFliVUhXQmppNGR1IiwiYyI6ImVkc2lndHNLRUQ2cXp2aXQ1cm5iRFRZRTE0b1VLeHdSb1p5U29QeWtLYVIyQTFKd2JDMmJmbkZKelJoamZObk5nRDR1YlRUdXJ0Z0JoZEtqRWRxbmhhRHlzdTdNZ0NKVlE4RiIsImNsIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIn19',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        id: 'eccda1db05c04ded9201f1b114b55efe',
        amount: new BigNumber('384803.383202'),
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
          as: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          s: {
            k: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
            c: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3',
            cl: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F'
          }
        },
        'eyJpIjoiMmU3NDNiNjItMjUyNi00NjMwLTk3NTQtNjRiYmE4MDgxZTdkIiwiYSI6IjgzODMuMzgzMjAyMjgzODIyODMyMjMyIiwiYXMiOiJLVDFLOWdDUmdhTFJGS1RFcll0MXdWeEEzRnJiOUZqYXNqVFYiLCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJzIjp7ImsiOiJlZHBrdGZRWVFYUFFCMm1lY3lzekJ2WFNWVXoxczNVN2lodHRpSm9tRmd4WWJVSFdCamk0ZHUiLCJjIjoiZWRzaWd1NnpaNTRZaGlxaTNKZndpWFFVaExETDNVNk1iTkhXaTF1d0Q2U1JlVVBjc3N6dXc1TWQ1UDJRR2pqdG53dUxlY3pBQlZac21vYnpEU25tOGlleHVMSGd4V3E0Zm0zIiwiY2wiOiJlZHNpZ3RzS0VENnF6dml0NXJuYkRUWUUxNG9VS3h3Um9aeVNvUHlrS2FSMkExSndiQzJiZm5GSnpSaGpmTm5OZ0Q0dWJUVHVydGdCaGRLakVkcW5oYUR5c3U3TWdDSlZROEYifX0',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        id: '2e743b62-2526-4630-9754-64bba8081e7d',
        amount: new BigNumber('8383.383202283822832232'),
        asset: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
        created: createdDate,
        expired: undefined,
        signature: {
          signingPublicKey: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
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
        'eyJpIjoiNDM5MzQzOCIsImEiOiIzOTM5NDM5NDMwNDAzIiwiZCI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYiLCJpdGVtc0NvdW50IjoxMH0sInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt2TlpDMmRqcHU0MjR1MnpXQ215c3Y3eUYxMzQzdFZXNXBLU2pRUXppVFV0UHpKWXhnNiIsImMiOiJlZHNpZ3U2elo1NFloaXFpM0pmd2lYUVVoTERMM1U2TWJOSFdpMXV3RDZTUmVVUGNzc3p1dzVNZDVQMlFHamp0bnd1TGVjekFCVlpzbW9iekRTbm04aWV4dUxIZ3hXcTRmbTMiLCJjbCI6ImVkc2lndHNLRUQ2cXp2aXQ1cm5iRFRZRTE0b1VLeHdSb1p5U29QeWtLYVIyQTFKd2JDMmJmbkZKelJoamZObk5nRDR1YlRUdXJ0Z0JoZEtqRWRxbmhhRHlzdTdNZ0NKVlE4RiJ9fQ',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        id: '4393438',
        amount: new BigNumber('3939439430403'),
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
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
          },
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          s: {
            k: 'edpkvNZC2djpu424u2zWCmysv7yF1343tVW5pKSjQQziTUtPzJYxg6',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
          }
        },
        'eyJpIjoid1UyUWpIRVFwazZuWUN2NTU1cVpYUT09IiwiYSI6Ijc0Ny4yMzgzNCIsImQiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In0sImMiOjE2MjQ2Njc4MjM5MzAsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt2TlpDMmRqcHU0MjR1MnpXQ215c3Y3eUYxMzQzdFZXNXBLU2pRUXppVFV0UHpKWXhnNiIsImMiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oifX0',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Payment,
        id: 'wU2QjHEQpk6nYCv555qZXQ==',
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
        },
        ...nonSerializedSlice
      })
    ],
  ];

export default validSerializedPaymentTestCases;
