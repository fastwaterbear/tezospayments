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
        'eyJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsib3JkZXIiOnsiaWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiYyI6MTYyNDY2NzgyMzkzMCwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0ZlVxWUJBY21qTkJQZ2lidTNQRkw2a3NtRzdzb0Zidlo0Tkhjc3lXbUxRZUp5S2p5YSIsImMiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oiLCJjbCI6ImVkc2lndTZ6WjU0WWhpcWkzSmZ3aVhRVWhMREwzVTZNYk5IV2kxdXdENlNSZVVQY3NzenV3NU1kNVAyUUdqanRud3VMZWN6QUJWWnNtb2J6RFNubThpZXh1TEhneFdxNGZtMyJ9fQ',
      ]
    ],
    [
      'payment without some required fields, c (created)',
      [
        {
          i: '4ab68d1d14f1404782398e1a3777b2e0',
          a: '3939439430403',
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
        'eyJpIjoiNGFiNjhkMWQxNGYxNDA0NzgyMzk4ZTFhMzc3N2IyZTAiLCJhIjoiMzkzOTQzOTQzMDQwMyIsImQiOnsib3JkZXIiOnsiaWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9fSwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0ZlVxWUJBY21qTkJQZ2lidTNQRkw2a3NtRzdzb0Zidlo0Tkhjc3lXbUxRZUp5S2p5YSIsImMiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oiLCJjbCI6ImVkc2lndTZ6WjU0WWhpcWkzSmZ3aVhRVWhMREwzVTZNYk5IV2kxdXdENlNSZVVQY3NzenV3NU1kNVAyUUdqanRud3VMZWN6QUJWWnNtb2J6RFNubThpZXh1TEhneFdxNGZtMyJ9fQ',
      ]
    ],
    [
      'payment with excess fields (a fields count is greater than the maximum)',
      [
        {
          i: 'e0322ce969454336b369eccfbf5f7066',
          a: '3939439430403',
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
        'eyJpIjoiZTAzMjJjZTk2OTQ1NDMzNmIzNjllY2NmYmY1ZjcwNjYiLCJhIjoiMzkzOTQzOTQzMDQwMyIsInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0dUthRVVHMVlQakxTZmQ5MWVUYWtZVjZlS2NaQXQyRHM3cWZvUzJZVEFpMjVtdlpUcCIsImMiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oiLCJjbCI6ImVkc2lndHNYYlYzQzVXVTIzcEVWS1d5NktCTFlSc3JSMWFMWHJOamhBdFphU0hQTmVIdmgxWWZERXFadEZNcXgxUkE4UlJHVDJRaVI4c1hQWlFSb3N4M0d0R0Zjb2dXdFFmZCJ9LCJlX2ZfMCI6MCwiZV9mXzEiOjEwMCwiZV9mXzIiOjIwMCwiZV9mXzMiOjMwMCwiZV9mXzQiOjQwMCwiZV9mXzUiOjUwMCwiZV9mXzYiOjYwMCwiZV9mXzciOjcwMCwiZV9mXzgiOjgwMCwiZV9mXzkiOjkwMCwiZV9mXzEwIjoxMDAwLCJlX2ZfMTEiOjExMDAsImVfZl8xMiI6MTIwMCwiZV9mXzEzIjoxMzAwLCJlX2ZfMTQiOjE0MDAsImVfZl8xNSI6MTUwMCwiZV9mXzE2IjoxNjAwLCJlX2ZfMTciOjE3MDAsImVfZl8xOCI6MTgwMCwiZV9mXzE5IjoxOTAwLCJlX2ZfMjAiOjIwMDAsImVfZl8yMSI6MjEwMCwiZV9mXzIyIjoyMjAwLCJlX2ZfMjMiOjIzMDAsImVfZl8yNCI6MjQwMCwiZV9mXzI1IjoyNTAwLCJlX2ZfMjYiOjI2MDAsImVfZl8yNyI6MjcwMCwiZV9mXzI4IjoyODAwLCJlX2ZfMjkiOjI5MDB9',
      ]
    ],
    [
      'payment with invalid field types (id)',
      [
        {
          i: Infinity,
          a: '3939439430403',
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
        'eyJpIjpudWxsLCJhIjoiMzkzOTQzOTQzMDQwMyIsInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0dUthRVVHMVlQakxTZmQ5MWVUYWtZVjZlS2NaQXQyRHM3cWZvUzJZVEFpMjVtdlpUcCIsImMiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oiLCJjbCI6ImVkc2lndHNYYlYzQzVXVTIzcEVWS1d5NktCTFlSc3JSMWFMWHJOamhBdFphU0hQTmVIdmgxWWZERXFadEZNcXgxUkE4UlJHVDJRaVI4c1hQWlFSb3N4M0d0R0Zjb2dXdFFmZCJ9fQ',
      ],
    ],
    [
      'payment with invalid field types (amount)',
      [
        {
          i: '1034394',
          a: 35039,
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
        'eyJpIjoiMTAzNDM5NCIsImEiOjM1MDM5LCJkIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiJ9LCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjI0NjY3ODIzOTMwLCJlIjoxNjI0NjY5MDIzOTMwLCJzIjp7ImsiOiJlZHBrdHVLYUVVRzFZUGpMU2ZkOTFlVGFrWVY2ZUtjWkF0MkRzN3Fmb1MyWVRBaTI1bXZaVHAiLCJjIjoiZWRzaWd0c0tFRDZxenZpdDVybmJEVFlFMTRvVUt4d1JvWnlTb1B5a0thUjJBMUp3YkMyYmZuRkp6UmhqZk5uTmdENHViVFR1cnRnQmhkS2pFZHFuaGFEeXN1N01nQ0pWUThGIiwiY2wiOiJlZHNpZ3RjRnA0UFZHblQzWk5UTmlQbzRHeXlSS0daQlViYTFLbndWeUd5R0plMzJIY1N2YkdhV1NLa1dzZGRSYVFDZUNUdUczQm0zdEs4R2Q4bll3aUI5YnNuTXhkZlB1a1oifX0',
      ],
    ],
    [
      'payment with invalid field types (success link)',
      [
        {
          i: 'a85f43e5-21d8-4e87-bf8c-3af1435a1088',
          a: '3939439430403',
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
        'eyJpIjoiYTg1ZjQzZTUtMjFkOC00ZTg3LWJmOGMtM2FmMTQzNWExMDg4IiwiYSI6IjM5Mzk0Mzk0MzA0MDMiLCJkIjp7Im9yZGVySWQiOiIwYTZkMmRiMTgxZmE0ZWM3YTdkYmZiN2I3MjgyMDFmNiIsIml0ZW1zQ291bnQiOjEwfSwic3UiOiI8c2NyaXB0PmFsZXJ0KDEpPC9zY3JpcHQ-IiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MjQ2Njc4MjM5MzAsImUiOjE2MjQ2NjkwMjM5MzAsInMiOnsiayI6ImVkcGt0dUthRVVHMVlQakxTZmQ5MWVUYWtZVjZlS2NaQXQyRHM3cWZvUzJZVEFpMjVtdlpUcCIsImMiOiJlZHNpZ3RzS0VENnF6dml0NXJuYkRUWUUxNG9VS3h3Um9aeVNvUHlrS2FSMkExSndiQzJiZm5GSnpSaGpmTm5OZ0Q0dWJUVHVydGdCaGRLakVkcW5oYUR5c3U3TWdDSlZROEYiLCJjbCI6ImVkc2lndGNGcDRQVkduVDNaTlROaVBvNEd5eVJLR1pCVWJhMUtud1Z5R3lHSmUzMkhjU3ZiR2FXU0trV3NkZFJhUUNlQ1R1RzNCbTN0SzhHZDhuWXdpQjlic25NeGRmUHVrWiJ9fQ',
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
