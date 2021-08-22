/* eslint-disable max-len */
import { LegacySerializedDonation } from '../../../../src';

const legacyDonationDeserializerNegativeTestCases: ReadonlyArray<readonly [
  message: string | null,
  serializedDonation: readonly [serializedDonation: LegacySerializedDonation, serializedDonationBase64: string]
]> = [
    [
      'donation with excess fields (a fields count is greater than the maximum)',
      [
        {
          ...[...new Array(30)].reduce((obj, _, index) => {
            obj[`someExtraField${index}`] = index * 100;

            return obj;
          }, {})
        },
        'eyJzb21lRXh0cmFGaWVsZDAiOjAsInNvbWVFeHRyYUZpZWxkMSI6MTAwLCJzb21lRXh0cmFGaWVsZDIiOjIwMCwic29tZUV4dHJhRmllbGQzIjozMDAsInNvbWVFeHRyYUZpZWxkNCI6NDAwLCJzb21lRXh0cmFGaWVsZDUiOjUwMCwic29tZUV4dHJhRmllbGQ2Ijo2MDAsInNvbWVFeHRyYUZpZWxkNyI6NzAwLCJzb21lRXh0cmFGaWVsZDgiOjgwMCwic29tZUV4dHJhRmllbGQ5Ijo5MDAsInNvbWVFeHRyYUZpZWxkMTAiOjEwMDAsInNvbWVFeHRyYUZpZWxkMTEiOjExMDAsInNvbWVFeHRyYUZpZWxkMTIiOjEyMDAsInNvbWVFeHRyYUZpZWxkMTMiOjEzMDAsInNvbWVFeHRyYUZpZWxkMTQiOjE0MDAsInNvbWVFeHRyYUZpZWxkMTUiOjE1MDAsInNvbWVFeHRyYUZpZWxkMTYiOjE2MDAsInNvbWVFeHRyYUZpZWxkMTciOjE3MDAsInNvbWVFeHRyYUZpZWxkMTgiOjE4MDAsInNvbWVFeHRyYUZpZWxkMTkiOjE5MDAsInNvbWVFeHRyYUZpZWxkMjAiOjIwMDAsInNvbWVFeHRyYUZpZWxkMjEiOjIxMDAsInNvbWVFeHRyYUZpZWxkMjIiOjIyMDAsInNvbWVFeHRyYUZpZWxkMjMiOjIzMDAsInNvbWVFeHRyYUZpZWxkMjQiOjI0MDAsInNvbWVFeHRyYUZpZWxkMjUiOjI1MDAsInNvbWVFeHRyYUZpZWxkMjYiOjI2MDAsInNvbWVFeHRyYUZpZWxkMjciOjI3MDAsInNvbWVFeHRyYUZpZWxkMjgiOjI4MDAsInNvbWVFeHRyYUZpZWxkMjkiOjI5MDB9',
      ]
    ],
    [
      'donation with invalid field types (desired amount)',
      [
        {
          desiredAmount: 35039
        },
        'eyJkZXNpcmVkQW1vdW50IjozNTAzOX0=',
      ],
    ],
    [
      'donation with invalid field types (success link)',
      [
        {
          desiredAmount: '3939439430403',
          successUrl: '<script>alert(1)</script>',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
        },
        'eyJkZXNpcmVkQW1vdW50IjoiMzkzOTQzOTQzMDQwMyIsInN1Y2Nlc3NVcmwiOiI8c2NyaXB0PmFsZXJ0KDEpPC9zY3JpcHQ+IiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvZG9uYXRpb24vY2FuY2VsIn0=',
      ]
    ],
    [
      'donation with invalid field types (desired asset)',
      [
        {
          desiredAmount: '8383.383202283822832232',
          desiredAsset: { value: 3333333 }
        },
        'eyJkZXNpcmVkQW1vdW50IjoiODM4My4zODMyMDIyODM4MjI4MzIyMzIiLCJkZXNpcmVkQXNzZXQiOnsidmFsdWUiOjMzMzMzMzN9fQ==',
      ]
    ],
    [
      'invalid donation object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [undefined as any, 'U29tZSB0ZXh0']
    ]
  ];

export default legacyDonationDeserializerNegativeTestCases;
