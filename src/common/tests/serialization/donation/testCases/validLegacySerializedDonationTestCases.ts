/* eslint-disable max-len */
import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { LegacySerializedDonation, NonSerializedDonationSlice, Donation, PaymentType } from '../../../../src';

const validLegacySerializedDonationTestCases: ReadonlyArray<readonly [
  message: string | null,
  testValue: readonly [serializedDonation: LegacySerializedDonation, serializedDonationBase64: string],
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
          desiredAmount: '384803.383202',
        },
        'eyJkZXNpcmVkQW1vdW50IjoiMzg0ODAzLjM4MzIwMiJ9',
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
          desiredAsset: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        },
        'eyJkZXNpcmVkQXNzZXQiOiJLVDFLOWdDUmdhTFJGS1RFcll0MXdWeEEzRnJiOUZqYXNqVFYifQ',
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
          successUrl: 'https://fastwaterbear.com/tezospayments/test/donation/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
        },
        'eyJzdWNjZXNzVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvZG9uYXRpb24vc3VjY2VzcyIsImNhbmNlbFVybCI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL2NhbmNlbCJ9',
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

export default validLegacySerializedDonationTestCases;
