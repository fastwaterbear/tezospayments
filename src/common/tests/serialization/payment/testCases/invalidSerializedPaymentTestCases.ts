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
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
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
        'eyJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYyI6MTYyNDY2NzgyMzkzMCwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0ZlVxWUJBY21qTkJQZ2lidTNQRkw2a3NtRzdzb0Zidlo0Tkhjc3lXbUxRZUp5S2p5YSIsImMiOiJlZHNpZ3RhTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9nMk5kc28iLCJjbCI6ImVkc2lndGFOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb2cyTmRzbyJ9fQ',
      ]
    ],
    [
      'payment without some required fields, c (created)',
      [
        {
          i: '4ab68d1d14f1404782398e1a3777b2e0',
          a: '3939439430403',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
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
        'eyJpIjoiNGFiNjhkMWQxNGYxNDA0NzgyMzk4ZTFhMzc3N2IyZTAiLCJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0ZlVxWUJBY21qTkJQZ2lidTNQRkw2a3NtRzdzb0Zidlo0Tkhjc3lXbUxRZUp5S2p5YSIsImMiOiJlZHNpZ3RhTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9nMk5kc28iLCJjbCI6ImVkc2lndGFOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb2cyTmRzbyJ9fQ',
      ]
    ],
    [
      'payment with excess fields (a fields count is greater than the maximum)',
      [
        {
          i: 'e0322ce969454336b369eccfbf5f7066',
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
        'eyJpIjoiZTAzMjJjZTk2OTQ1NDMzNmIzNjllY2NmYmY1ZjcwNjYiLCJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwiZSI6MTYyNDY2OTAyMzkzMCwicyI6eyJrIjoiZWRwa3R1S2FFVUcxWVBqTFNmZDkxZVRha1lWNmVLY1pBdDJEczdxZm9TMllUQWkyNW12WlRwIiwiYyI6ImVkc2lndGFOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb2cyTmRzbyIsImNsIjoiZWRzaWd0YU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vZzJOZHNvIn0sImVfZl8wIjowLCJlX2ZfMSI6MTAwLCJlX2ZfMiI6MjAwLCJlX2ZfMyI6MzAwLCJlX2ZfNCI6NDAwLCJlX2ZfNSI6NTAwLCJlX2ZfNiI6NjAwLCJlX2ZfNyI6NzAwLCJlX2ZfOCI6ODAwLCJlX2ZfOSI6OTAwLCJlX2ZfMTAiOjEwMDAsImVfZl8xMSI6MTEwMCwiZV9mXzEyIjoxMjAwLCJlX2ZfMTMiOjEzMDAsImVfZl8xNCI6MTQwMCwiZV9mXzE1IjoxNTAwLCJlX2ZfMTYiOjE2MDAsImVfZl8xNyI6MTcwMCwiZV9mXzE4IjoxODAwLCJlX2ZfMTkiOjE5MDAsImVfZl8yMCI6MjAwMCwiZV9mXzIxIjoyMTAwLCJlX2ZfMjIiOjIyMDAsImVfZl8yMyI6MjMwMCwiZV9mXzI0IjoyNDAwLCJlX2ZfMjUiOjI1MDAsImVfZl8yNiI6MjYwMCwiZV9mXzI3IjoyNzAwLCJlX2ZfMjgiOjI4MDAsImVfZl8yOSI6MjkwMH0',
      ]
    ],
    [
      'payment with invalid field types (id)',
      [
        {
          i: Infinity,
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
          s: {
            k: 'edpktuKaEUG1YPjLSfd91eTakYV6eKcZAt2Ds7qfoS2YTAi25mvZTp',
            c: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ',
            cl: 'edsigtsXbV3C5WU23pEVKWy6KBLYRsrR1aLXrNjhAtZaSHPNeHvh1YfDEqZtFMqx1RA8RRGT2QiR8sXPZQRosx3GtGFcogWtQfd'
          },
        },
        'eyJpIjpudWxsLCJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYyNDY2NzgyMzkzMCwiZSI6MTYyNDY2OTAyMzkzMCwicyI6eyJrIjoiZWRwa3RmVXFZQkFjbWpOQlBnaWJ1M1BGTDZrc21HN3NvRmJ2WjROSGNzeVdtTFFlSnlLanlhIiwiYyI6ImVkc2lndGFOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb2cyTmRzbyIsImNsIjoiZWRzaWd0YU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vZzJOZHNvIn19',
      ],
    ],
    [
      'payment with invalid field types (amount)',
      [
        {
          i: '1034394',
          a: 35039,
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
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
        'eyJpIjoiMTAzNDM5NCIsImEiOjM1MDM5LCJkIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0dUthRVVHMVlQakxTZmQ5MWVUYWtZVjZlS2NaQXQyRHM3cWZvUzJZVEFpMjVtdlpUcCIsImMiOiJlZHNpZ3RhTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9nMk5kc28iLCJjbCI6ImVkc2lndGFOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb2cyTmRzbyJ9fQ',
      ],
    ],
    [
      'payment with invalid field types (success link)',
      [
        {
          i: 'a85f43e5-21d8-4e87-bf8c-3af1435a1088',
          a: '3939439430403',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6',
            }
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
        'eyJpIjoiYTg1ZjQzZTUtMjFkOC00ZTg3LWJmOGMtM2FmMTQzNWExMDg4IiwiYSI6IjM5Mzk0Mzk0MzA0MDMiLCJkIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMGE2ZDJkYjE4MWZhNGVjN2E3ZGJmYjdiNzI4MjAxZjYifX0sInN1IjoiPHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0PiIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdHVLYUVVRzFZUGpMU2ZkOTFlVGFrWVY2ZUtjWkF0MkRzN3Fmb1MyWVRBaTI1bXZaVHAiLCJjIjoiZWRzaWd0YU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vZzJOZHNvIiwiY2wiOiJlZHNpZ3RhTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9nMk5kc28ifX0',
      ]
    ],
    [
      'payment with invalid field types (asset)',
      [
        {
          i: '32793899-d3f8-4352-a61c-f0ec50987dc2',
          a: '8383.383202283822832232',
          d: {
            public: {
              orderId: '0a6d2db181fa4ec7a7dbfb7b728201f6'
            }
          },
          as: { value: 3333333 },
          su: 'https://fastwaterbear.com/tezospayments/test/payment/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/payment/cancel',
          c: createdDate.getTime(),
          s: {
            k: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
            c: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
            cl: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
          },
        },
        'eyJpIjoiMzI3OTM4OTktZDNmOC00MzUyLWE2MWMtZjBlYzUwOTg3ZGMyIiwiYSI6IjgzODMuMzgzMjAyMjgzODIyODMyMjMyIiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjBhNmQyZGIxODFmYTRlYzdhN2RiZmI3YjcyODIwMWY2In19LCJhcyI6eyJ2YWx1ZSI6MzMzMzMzM30sInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsInMiOnsiayI6ImVkcGt0ZlFZUVhQUUIybWVjeXN6QnZYU1ZVejFzM1U3aWh0dGlKb21GZ3hZYlVIV0JqaTRkdSIsImMiOiJlZHNpZ3RhTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9nMk5kc28iLCJjbCI6ImVkc2lndGFOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb25lTm9uZU5vbmVOb2cyTmRzbyJ9fQ',
      ]
    ],
    [
      'invalid payment object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [undefined as any, 'U29tZSB0ZXh0']
    ]
  ];

export default invalidSerializedPaymentTestCases;
