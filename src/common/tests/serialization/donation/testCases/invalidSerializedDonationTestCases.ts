/* eslint-disable max-len */
import { SerializedDonation } from '../../../../src';

const invalidSerializedDonationTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [serializedDonation: SerializedDonation, serializedDonationBase64: string]
]> = [
    [
      'donation with excess fields (a fields count is greater than the maximum)',
      [
        {
          ...[...new Array(30)].reduce((obj, _, index) => {
            obj[`e_f_${index}`] = index * 100;

            return obj;
          }, {})
        },
        'eyJlX2ZfMCI6MCwiZV9mXzEiOjEwMCwiZV9mXzIiOjIwMCwiZV9mXzMiOjMwMCwiZV9mXzQiOjQwMCwiZV9mXzUiOjUwMCwiZV9mXzYiOjYwMCwiZV9mXzciOjcwMCwiZV9mXzgiOjgwMCwiZV9mXzkiOjkwMCwiZV9mXzEwIjoxMDAwLCJlX2ZfMTEiOjExMDAsImVfZl8xMiI6MTIwMCwiZV9mXzEzIjoxMzAwLCJlX2ZfMTQiOjE0MDAsImVfZl8xNSI6MTUwMCwiZV9mXzE2IjoxNjAwLCJlX2ZfMTciOjE3MDAsImVfZl8xOCI6MTgwMCwiZV9mXzE5IjoxOTAwLCJlX2ZfMjAiOjIwMDAsImVfZl8yMSI6MjEwMCwiZV9mXzIyIjoyMjAwLCJlX2ZfMjMiOjIzMDAsImVfZl8yNCI6MjQwMCwiZV9mXzI1IjoyNTAwLCJlX2ZfMjYiOjI2MDAsImVfZl8yNyI6MjcwMCwiZV9mXzI4IjoyODAwLCJlX2ZfMjkiOjI5MDB9',
      ]
    ],
    [
      'donation with invalid field types (desired amount)',
      [
        {
          da: 35039
        },
        'eyJkYSI6MzUwMzl9',
      ],
    ],
    [
      'donation with invalid field types (success link)',
      [
        {
          da: '3939439430403',
          su: '<script>alert(1)</script>',
          cu: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
          s: {
            k: 'edskRvH8WRyuVQve1XgV11wXWsU2dPgARqJEi9TRkV9jGWDN54tyXarWE9kJtaD5GEFHZN1B5wc25PLV6wYH2AW7riHeou3HNe',
            cl: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3'
          }
        },
        'eyJkYSI6IjM5Mzk0Mzk0MzA0MDMiLCJzdSI6IjxzY3JpcHQ-YWxlcnQoMSk8L3NjcmlwdD4iLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL2NhbmNlbCIsInMiOnsiayI6ImVkc2tSdkg4V1J5dVZRdmUxWGdWMTF3WFdzVTJkUGdBUnFKRWk5VFJrVjlqR1dETjU0dHlYYXJXRTlrSnRhRDVHRUZIWk4xQjV3YzI1UExWNndZSDJBVzdyaUhlb3UzSE5lIiwiY2wiOiJlZHNpZ3U2elo1NFloaXFpM0pmd2lYUVVoTERMM1U2TWJOSFdpMXV3RDZTUmVVUGNzc3p1dzVNZDVQMlFHamp0bnd1TGVjekFCVlpzbW9iekRTbm04aWV4dUxIZ3hXcTRmbTMifX0',
      ]
    ],
    [
      'donation with invalid field types (desired asset)',
      [
        {
          da: '8383.383202283822832232',
          das: { value: 3333333 }
        },
        'eyJkYSI6IjgzODMuMzgzMjAyMjgzODIyODMyMjMyIiwiZGFzIjp7InZhbHVlIjozMzMzMzMzfX0',
      ]
    ],
    [
      'donation with invalid field types (data)',
      [
        {
          da: '38843.37343',
          d: 94
        },
        'eyJkYSI6IjM4ODQzLjM3MzQzIiwiZCI6OTR9',
      ]
    ],
    [
      'invalid donation object',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [undefined as any, 'U29tZSB0ZXh0']
    ]
  ];

export default invalidSerializedDonationTestCases;
