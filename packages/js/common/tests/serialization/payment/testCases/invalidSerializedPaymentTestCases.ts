/* eslint-disable max-len */
import { SerializedPayment } from '../../../../src';

const createdDate = new Date('2021-06-26T00:37:03.930Z');
const expiredDate = new Date('2021-06-26T00:57:03.930Z');

const invalidSerializedPaymentTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [serializedPayment: SerializedPayment, serializedPaymentBase64: string]
]> = [
    [
      'payment without some required fields, i (id)',
      [
        {
          // i: ,
          a: '3939439430403',
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          d: {
            order: {
              id: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          c: createdDate.getTime(),
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          e: expiredDate.getTime(),
          s: {
            k: 'edpktfUqYBAcmjNBPgibu3PFL6ksmG7soFbvZ4NHcsyWmLQeJyKjya',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
            cl: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3'
          }
        },
        'eyJhIjoiMzkzOTQzOTQzMDQwMyIsInQiOiJLVDFKNXJYRlFNRzJpSGZBNEVocEtkRnlRVlFBVlk4d0hmNngiLCJkIjp7Im9yZGVyIjp7ImlkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sImMiOjE2MjQ2Njc4MjM5MzAsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdGZVcVlCQWNtak5CUGdpYnUzUEZMNmtzbUc3c29GYnZaNE5IY3N5V21MUWVKeUtqeWEiLCJjIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIiwiY2wiOiJlZHNpZ3U2elo1NFloaXFpM0pmd2lYUVVoTERMM1U2TWJOSFdpMXV3RDZTUmVVUGNzc3p1dzVNZDVQMlFHamp0bnd1TGVjekFCVlpzbW9iekRTbm04aWV4dUxIZ3hXcTRmbTMifX0',
      ]
    ],
    [
      'payment without some required fields, t (target)',
      [
        {
          i: 'ae2036a39b1c49df993c0df87e061ca6',
          a: '3939439430403',
          d: {
            order: {
              id: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          c: createdDate.getTime(),
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          e: expiredDate.getTime(),
          s: {
            k: 'edpktfUqYBAcmjNBPgibu3PFL6ksmG7soFbvZ4NHcsyWmLQeJyKjya',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
            cl: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3'
          }
        },
        'eyJpIjoiYWUyMDM2YTM5YjFjNDlkZjk5M2MwZGY4N2UwNjFjYTYiLCJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsib3JkZXIiOnsiaWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYyI6MTYyNDY2NzgyMzkzMCwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0ZlVxWUJBY21qTkJQZ2lidTNQRkw2a3NtRzdzb0Zidlo0Tkhjc3lXbUxRZUp5S2p5YSIsImMiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oiLCJjbCI6ImVkc2lndTZ6WjU0WWhpcWkzSmZ3aVhRVWhMREwzVTZNYk5IV2kxdXdENlNSZVVQY3NzenV3NU1kNVAyUUdqanRud3VMZWN6QUJWWnNtb2J6RFNubThpZXh1TEhneFdxNGZtMyJ9fQ',
      ]
    ],
    [
      'payment without some required fields, c (created)',
      [
        {
          i: '4ab68d1d14f1404782398e1a3777b2e0',
          a: '3939439430403',
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          d: {
            order: {
              id: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
          },
          // c: ,
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          e: expiredDate.getTime(),
          s: {
            k: 'edpktfUqYBAcmjNBPgibu3PFL6ksmG7soFbvZ4NHcsyWmLQeJyKjya',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
            cl: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3'
          }
        },
        'eyJpIjoiNGFiNjhkMWQxNGYxNDA0NzgyMzk4ZTFhMzc3N2IyZTAiLCJhIjoiMzkzOTQzOTQzMDQwMyIsInQiOiJLVDFKNXJYRlFNRzJpSGZBNEVocEtkRnlRVlFBVlk4d0hmNngiLCJkIjp7Im9yZGVyIjp7ImlkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdGZVcVlCQWNtak5CUGdpYnUzUEZMNmtzbUc3c29GYnZaNE5IY3N5V21MUWVKeUtqeWEiLCJjIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIiwiY2wiOiJlZHNpZ3U2elo1NFloaXFpM0pmd2lYUVVoTERMM1U2TWJOSFdpMXV3RDZTUmVVUGNzc3p1dzVNZDVQMlFHamp0bnd1TGVjekFCVlpzbW9iekRTbm04aWV4dUxIZ3hXcTRmbTMifX0',
      ]
    ],
    [
      'payment with excess fields (a fields count is greater than the maximum)',
      [
        {
          i: 'e0322ce969454336b369eccfbf5f7066',
          a: '3939439430403',
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          s: {
            k: 'edpktuKaEUG1YPjLSfd91eTakYV6eKcZAt2Ds7qfoS2YTAi25mvZTp',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
            cl: 'edsigtsXbV3C5WU23pEVKWy6KBLYRsrR1aLXrNjhAtZaSHPNeHvh1YfDEqZtFMqx1RA8RRGT2QiR8sXPZQRosx3GtGFcogWtQfd'
          },
          ...[...new Array(30)].reduce((obj, _, index) => {
            obj[`e_f_${index}`] = index * 100;

            return obj;
          }, {})
        },
        'eyJpIjoiZTAzMjJjZTk2OTQ1NDMzNmIzNjllY2NmYmY1ZjcwNjYiLCJhIjoiMzkzOTQzOTQzMDQwMyIsInQiOiJLVDFKNXJYRlFNRzJpSGZBNEVocEtkRnlRVlFBVlk4d0hmNngiLCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdHVLYUVVRzFZUGpMU2ZkOTFlVGFrWVY2ZUtjWkF0MkRzN3Fmb1MyWVRBaTI1bXZaVHAiLCJjIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIiwiY2wiOiJlZHNpZ3RzWGJWM0M1V1UyM3BFVktXeTZLQkxZUnNyUjFhTFhyTmpoQXRaYVNIUE5lSHZoMVlmREVxWnRGTXF4MVJBOFJSR1QyUWlSOHNYUFpRUm9zeDNHdEdGY29nV3RRZmQifSwiZV9mXzAiOjAsImVfZl8xIjoxMDAsImVfZl8yIjoyMDAsImVfZl8zIjozMDAsImVfZl80Ijo0MDAsImVfZl81Ijo1MDAsImVfZl82Ijo2MDAsImVfZl83Ijo3MDAsImVfZl84Ijo4MDAsImVfZl85Ijo5MDAsImVfZl8xMCI6MTAwMCwiZV9mXzExIjoxMTAwLCJlX2ZfMTIiOjEyMDAsImVfZl8xMyI6MTMwMCwiZV9mXzE0IjoxNDAwLCJlX2ZfMTUiOjE1MDAsImVfZl8xNiI6MTYwMCwiZV9mXzE3IjoxNzAwLCJlX2ZfMTgiOjE4MDAsImVfZl8xOSI6MTkwMCwiZV9mXzIwIjoyMDAwLCJlX2ZfMjEiOjIxMDAsImVfZl8yMiI6MjIwMCwiZV9mXzIzIjoyMzAwLCJlX2ZfMjQiOjI0MDAsImVfZl8yNSI6MjUwMCwiZV9mXzI2IjoyNjAwLCJlX2ZfMjciOjI3MDAsImVfZl8yOCI6MjgwMCwiZV9mXzI5IjoyOTAwfQ',
      ]
    ],
    [
      'payment with invalid field types (id)',
      [
        {
          i: Infinity,
          a: '3939439430403',
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          s: {
            k: 'edpktuKaEUG1YPjLSfd91eTakYV6eKcZAt2Ds7qfoS2YTAi25mvZTp',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
            cl: 'edsigtsXbV3C5WU23pEVKWy6KBLYRsrR1aLXrNjhAtZaSHPNeHvh1YfDEqZtFMqx1RA8RRGT2QiR8sXPZQRosx3GtGFcogWtQfd'
          },
        },
        'eyJpIjpudWxsLCJhIjoiMzkzOTQzOTQzMDQwMyIsInQiOiJLVDFKNXJYRlFNRzJpSGZBNEVocEtkRnlRVlFBVlk4d0hmNngiLCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdHVLYUVVRzFZUGpMU2ZkOTFlVGFrWVY2ZUtjWkF0MkRzN3Fmb1MyWVRBaTI1bXZaVHAiLCJjIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIiwiY2wiOiJlZHNpZ3RzWGJWM0M1V1UyM3BFVktXeTZLQkxZUnNyUjFhTFhyTmpoQXRaYVNIUE5lSHZoMVlmREVxWnRGTXF4MVJBOFJSR1QyUWlSOHNYUFpRUm9zeDNHdEdGY29nV3RRZmQifX0',
      ],
    ],
    [
      'payment with invalid field types (amount)',
      [
        {
          i: '1034394',
          a: 35039,
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          d: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          s: {
            k: 'edpktuKaEUG1YPjLSfd91eTakYV6eKcZAt2Ds7qfoS2YTAi25mvZTp',
            c: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
            cl: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
          },
        },
        'eyJpIjoiMTAzNDM5NCIsImEiOjM1MDM5LCJ0IjoiS1QxSjVyWEZRTUcyaUhmQTRFaHBLZEZ5UVZRQVZZOHdIZjZ4IiwiZCI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwiZSI6MTYyNDY2OTAyMzkzMCwicyI6eyJrIjoiZWRwa3R1S2FFVUcxWVBqTFNmZDkxZVRha1lWNmVLY1pBdDJEczdxZm9TMllUQWkyNW12WlRwIiwiYyI6ImVkc2lndHNLRUQ2cXp2aXQ1cm5iRFRZRTE0b1VLeHdSb1p5U29QeWtLYVIyQTFKd2JDMmJmbkZKelJoamZObk5nRDR1YlRUdXJ0Z0JoZEtqRWRxbmhhRHlzdTdNZ0NKVlE4RiIsImNsIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIn19',
      ],
    ],
    [
      'payment with invalid field types (target)',
      [
        {
          i: '1034394',
          a: 35039,
          t: { address: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x' },
          d: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
          },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          s: {
            k: 'edpktuKaEUG1YPjLSfd91eTakYV6eKcZAt2Ds7qfoS2YTAi25mvZTp',
            c: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
            cl: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
          },
        },
        'eyJpIjoiMTAzNDM5NCIsImEiOjM1MDM5LCJ0Ijp7ImFkZHJlc3MiOiJLVDFKNXJYRlFNRzJpSGZBNEVocEtkRnlRVlFBVlk4d0hmNngifSwiZCI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwiZSI6MTYyNDY2OTAyMzkzMCwicyI6eyJrIjoiZWRwa3R1S2FFVUcxWVBqTFNmZDkxZVRha1lWNmVLY1pBdDJEczdxZm9TMllUQWkyNW12WlRwIiwiYyI6ImVkc2lndHNLRUQ2cXp2aXQ1cm5iRFRZRTE0b1VLeHdSb1p5U29QeWtLYVIyQTFKd2JDMmJmbkZKelJoamZObk5nRDR1YlRUdXJ0Z0JoZEtqRWRxbmhhRHlzdTdNZ0NKVlE4RiIsImNsIjoiZWRzaWd0Y0ZwNFBWR25UM1pOVE5pUG80R3l5UktHWkJVYmExS253VnlHeUdKZTMySGNTdmJHYVdTS2tXc2RkUmFRQ2VDVHVHM0JtM3RLOEdkOG5Zd2lCOWJzbk14ZGZQdWtaIn19',
      ],
    ],
    [
      'payment with invalid field types (success link)',
      [
        {
          i: 'a85f43e5-21d8-4e87-bf8c-3af1435a1088',
          a: '3939439430403',
          t: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          d: {
            orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            itemsCount: 10
          },
          su: '<script>alert(1)</script>',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          e: expiredDate.getTime(),
          s: {
            k: 'edpktuKaEUG1YPjLSfd91eTakYV6eKcZAt2Ds7qfoS2YTAi25mvZTp',
            c: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
            cl: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
          },
        },
        'eyJpIjoiYTg1ZjQzZTUtMjFkOC00ZTg3LWJmOGMtM2FmMTQzNWExMDg4IiwiYSI6IjM5Mzk0Mzk0MzA0MDMiLCJ0IjoiS1QxSjVyWEZRTUcyaUhmQTRFaHBLZEZ5UVZRQVZZOHdIZjZ4IiwiZCI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYiLCJpdGVtc0NvdW50IjoxMH0sInN1IjoiPHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0PiIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdHVLYUVVRzFZUGpMU2ZkOTFlVGFrWVY2ZUtjWkF0MkRzN3Fmb1MyWVRBaTI1bXZaVHAiLCJjIjoiZWRzaWd0c0tFRDZxenZpdDVybmJEVFlFMTRvVUt4d1JvWnlTb1B5a0thUjJBMUp3YkMyYmZuRkp6UmhqZk5uTmdENHViVFR1cnRnQmhkS2pFZHFuaGFEeXN1N01nQ0pWUThGIiwiY2wiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oifX0-IiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0dUthRVVHMVlQakxTZmQ5MWVUYWtZVjZlS2NaQXQyRHM3cWZvUzJZVEFpMjVtdlpUcCIsImMiOiJlZHNpZ3RzS0VENnF6dml0NXJuYkRUWUUxNG9VS3h3Um9aeVNvUHlrS2FSMkExSndiQzJiZm5GSnpSaGpmTm5OZ0Q0dWJUVHVydGdCaGRLakVkcW5oYUR5c3U3TWdDSlZROEYiLCJjbCI6ImVkc2lndGNGcDRQVkduVDNaTlROaVBvNEd5eVJLR1pCVWJhMUtud1Z5R3lHSmUzMkhjU3ZiR2FXU0trV3NkZFJhUUNlQ1R1RzNCbTN0SzhHZDhuWXdpQjlic25NeGRmUHVrWiJ9fQ',
      ]
    ],
    // TODO
    // [
    //   'payment with invalid field types (asset)',
    //   [
    //     {
    //       i: '32793899-d3f8-4352-a61c-f0ec50987dc2',
    //       a: '8383.383202283822832232',
    //       d: {
    //         order: {
    //           id: '0a6d2db181fa4ec7a7dbfb7b728201f6',
    //           type: 30
    //         }
    //       },
    //       as: { value: 3333333 },
    //       su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
    //       cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
    //       c: createdDate.getTime(),
    //       s: {
    //         k: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
    //         c: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
    //         cl: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
    //       },
    //     },
    //     'eyJpIjoiMzI3OTM4OTktZDNmOC00MzUyLWE2MWMtZjBlYzUwOTg3ZGMyIiwiYSI6IjgzODMuMzgzMjAyMjgzODIyODMyMjMyIiwiZCI6eyJvcmRlciI6eyJpZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2IiwidHlwZSI6MzB9fSwiYXMiOnsidmFsdWUiOjMzMzMzMzN9LCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJzIjp7ImsiOiJlZHBrdGZRWVFYUFFCMm1lY3lzekJ2WFNWVXoxczNVN2lodHRpSm9tRmd4WWJVSFdCamk0ZHUiLCJjIjoiZWRzaWd0c0tFRDZxenZpdDVybmJEVFlFMTRvVUt4d1JvWnlTb1B5a0thUjJBMUp3YkMyYmZuRkp6UmhqZk5uTmdENHViVFR1cnRnQmhkS2pFZHFuaGFEeXN1N01nQ0pWUThGIiwiY2wiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oifX0',
    //   ]
    // ],
    [
      'invalid payment object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [undefined as any, 'U29tZSB0ZXh0']
    ]
  ];

export default invalidSerializedPaymentTestCases;
