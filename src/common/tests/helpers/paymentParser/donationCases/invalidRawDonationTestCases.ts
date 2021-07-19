/* eslint-disable max-len */
import type { RawDonation } from '../../../../src/helpers/paymentParser/donationParser';

const createdDate = new Date('2021-07-19T05:27:33.011Z');

const cases: ReadonlyArray<readonly [
  message: string | null,
  rawDonation: readonly [obj: RawDonation, serialized: string]
]> = [
    [
      'donation without some required fields',
      [
        {
          amount: '348493043011',
          // created: ,
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
        },
        'eyJhbW91bnQiOiIzNDg0OTMwNDMwMTEiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9kb25hdGlvbi9jYW5jZWwifQ==',
      ]
    ],
    [
      'donation with excess fields (a fields count is greater than the maximum)',
      [
        {
          amount: '348493043011',
          created: createdDate,
          successUrl: 'https://fastwaterbear.com/tezospayments/test/donation/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
          ...[...new Array(30)].reduce((obj, _, index) => {
            obj[`someExtraField${index}`] = index * 100;

            return obj;
          }, {})
        },
        'eyJhbW91bnQiOiIzNDg0OTMwNDMwMTEiLCJjcmVhdGVkIjoiMjAyMS0wNy0xOVQwNToyNzozMy4wMTFaIiwic3VjY2Vzc1VybCI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9kb25hdGlvbi9jYW5jZWwiLCJzb21lRXh0cmFGaWVsZDAiOjAsInNvbWVFeHRyYUZpZWxkMSI6MTAwLCJzb21lRXh0cmFGaWVsZDIiOjIwMCwic29tZUV4dHJhRmllbGQzIjozMDAsInNvbWVFeHRyYUZpZWxkNCI6NDAwLCJzb21lRXh0cmFGaWVsZDUiOjUwMCwic29tZUV4dHJhRmllbGQ2Ijo2MDAsInNvbWVFeHRyYUZpZWxkNyI6NzAwLCJzb21lRXh0cmFGaWVsZDgiOjgwMCwic29tZUV4dHJhRmllbGQ5Ijo5MDAsInNvbWVFeHRyYUZpZWxkMTAiOjEwMDAsInNvbWVFeHRyYUZpZWxkMTEiOjExMDAsInNvbWVFeHRyYUZpZWxkMTIiOjEyMDAsInNvbWVFeHRyYUZpZWxkMTMiOjEzMDAsInNvbWVFeHRyYUZpZWxkMTQiOjE0MDAsInNvbWVFeHRyYUZpZWxkMTUiOjE1MDAsInNvbWVFeHRyYUZpZWxkMTYiOjE2MDAsInNvbWVFeHRyYUZpZWxkMTciOjE3MDAsInNvbWVFeHRyYUZpZWxkMTgiOjE4MDAsInNvbWVFeHRyYUZpZWxkMTkiOjE5MDAsInNvbWVFeHRyYUZpZWxkMjAiOjIwMDAsInNvbWVFeHRyYUZpZWxkMjEiOjIxMDAsInNvbWVFeHRyYUZpZWxkMjIiOjIyMDAsInNvbWVFeHRyYUZpZWxkMjMiOjIzMDAsInNvbWVFeHRyYUZpZWxkMjQiOjI0MDAsInNvbWVFeHRyYUZpZWxkMjUiOjI1MDAsInNvbWVFeHRyYUZpZWxkMjYiOjI2MDAsInNvbWVFeHRyYUZpZWxkMjciOjI3MDAsInNvbWVFeHRyYUZpZWxkMjgiOjI4MDAsInNvbWVFeHRyYUZpZWxkMjkiOjI5MDB9',
      ]
    ],
    [
      'donation with invalid field types (amount)',
      [
        {
          amount: 35039,
          created: createdDate,
          successUrl: 'https://fastwaterbear.com/tezospayments/test/donation/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
        },
        'eyJhbW91bnQiOjM1MDM5LCJjcmVhdGVkIjoiMjAyMS0wNy0xOVQwNToyNzozMy4wMTFaIiwic3VjY2Vzc1VybCI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL3N1Y2Nlc3MiLCJjYW5jZWxVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9kb25hdGlvbi9jYW5jZWwifQ==',
      ],
    ],
    [
      'donation with invalid field types (success link)',
      [
        {
          amount: '3939439430403',
          created: createdDate,
          successUrl: '<script>alert(1)</script>',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
        },
        'eyJhbW91bnQiOiIzOTM5NDM5NDMwNDAzIiwiY3JlYXRlZCI6IjIwMjEtMDctMTlUMDU6Mjc6MzMuMDExWiIsInN1Y2Nlc3NVcmwiOiI8c2NyaXB0PmFsZXJ0KDEpPC9zY3JpcHQ+IiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvZG9uYXRpb24vY2FuY2VsIn0=',
      ]
    ],
    [
      'donation with invalid field types (asset)',
      [
        {
          amount: '8383.383202283822832232',
          created: createdDate,
          asset: { value: 3333333 },
          successUrl: 'https://fastwaterbear.com/tezospayments/test/donation/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
        },
        'eyJhbW91bnQiOiI4MzgzLjM4MzIwMjI4MzgyMjgzMjIzMiIsImNyZWF0ZWQiOiIyMDIxLTA3LTE5VDA1OjI3OjMzLjAxMVoiLCJhc3NldCI6eyJ2YWx1ZSI6MzMzMzMzM30sInN1Y2Nlc3NVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9kb25hdGlvbi9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvZG9uYXRpb24vY2FuY2VsIn0=',
      ]
    ],
    [
      'invalid donation object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [undefined as any, 'U29tZSB0ZXh0']
    ]
  ];

export default cases;
