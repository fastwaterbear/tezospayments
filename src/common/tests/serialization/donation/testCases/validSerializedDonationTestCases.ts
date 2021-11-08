/* eslint-disable max-len */
import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { SerializedDonation, NonSerializedDonationSlice, Donation, PaymentType } from '../../../../src';

const validSerializedDonationTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [serializedDonation: SerializedDonation, serializedDonationBase64: string],
  donationFactory: (nonSerializedDonationSlice: NonSerializedDonationSlice) => Donation
]> = [
    [
      'simple donation',
      [
        {},
        '',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Donation,
        desiredAmount: undefined,
        desiredAsset: undefined,
        successUrl: undefined,
        cancelUrl: undefined,
        signature: undefined,
        ...nonSerializedSlice
      })
    ],
    [
      'donation with the desired amount',
      [
        {
          da: '384803.383202',
        },
        'eyJkYSI6IjM4NDgwMy4zODMyMDIifQ',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Donation,
        desiredAmount: new BigNumber(384803.383202),
        desiredAsset: undefined,
        successUrl: undefined,
        cancelUrl: undefined,
        signature: undefined,
        ...nonSerializedSlice
      })
    ],
    [
      'donation with the desired asset (Kolibri USD)',
      [
        {
          das: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        },
        'eyJkYXMiOiJLVDFLOWdDUmdhTFJGS1RFcll0MXdWeEEzRnJiOUZqYXNqVFYifQ',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Donation,
        desiredAmount: undefined,
        desiredAsset: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        successUrl: undefined,
        cancelUrl: undefined,
        signature: undefined,
        ...nonSerializedSlice
      })
    ],
    [
      'donation with urls',
      [
        {
          su: 'https://fastwaterbear.com/tezospayments/test/donation/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
          s: {
            k: 'edskRvH8WRyuVQve1XgV11wXWsU2dPgARqJEi9TRkV9jGWDN54tyXarWE9kJtaD5GEFHZN1B5wc25PLV6wYH2AW7riHeou3HNe',
            cl: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3'
          }
        },
        'eyJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL2NhbmNlbCIsInMiOnsiayI6ImVkc2tSdkg4V1J5dVZRdmUxWGdWMTF3WFdzVTJkUGdBUnFKRWk5VFJrVjlqR1dETjU0dHlYYXJXRTlrSnRhRDVHRUZIWk4xQjV3YzI1UExWNndZSDJBVzdyaUhlb3UzSE5lIiwiY2wiOiJlZHNpZ3U2elo1NFloaXFpM0pmd2lYUVVoTERMM1U2TWJOSFdpMXV3RDZTUmVVUGNzc3p1dzVNZDVQMlFHamp0bnd1TGVjekFCVlpzbW9iekRTbm04aWV4dUxIZ3hXcTRmbTMifX0',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Donation,
        desiredAmount: undefined,
        desiredAsset: undefined,
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/donation/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/donation/cancel'),
        signature: {
          signingPublicKey: 'edskRvH8WRyuVQve1XgV11wXWsU2dPgARqJEi9TRkV9jGWDN54tyXarWE9kJtaD5GEFHZN1B5wc25PLV6wYH2AW7riHeou3HNe',
          client: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3'
        },
        ...nonSerializedSlice
      })
    ]
  ];

export default validSerializedDonationTestCases;
