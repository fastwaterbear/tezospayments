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
        ...nonSerializedSlice
      })
    ],
    [
      'donation with urls',
      [
        {
          su: 'https://fastwaterbear.com/tezospayments/test/donation/success',
          cu: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
        },
        'eyJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL2NhbmNlbCJ9',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Donation,
        desiredAmount: undefined,
        desiredAsset: undefined,
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/donation/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/donation/cancel'),
        ...nonSerializedSlice
      })
    ]
  ];

export default validSerializedDonationTestCases;
