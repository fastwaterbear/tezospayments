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
            k: 'edpkvNZC2djpu424u2zWCmysv7yF1343tVW5pKSjQQziTUtPzJYxg6',
            cl: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3'
          }
        },
        'eyJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L2RvbmF0aW9uL2NhbmNlbCIsInMiOnsiayI6ImVkcGt2TlpDMmRqcHU0MjR1MnpXQ215c3Y3eUYxMzQzdFZXNXBLU2pRUXppVFV0UHpKWXhnNiIsImNsIjoiZWRzaWd1NnpaNTRZaGlxaTNKZndpWFFVaExETDNVNk1iTkhXaTF1d0Q2U1JlVVBjc3N6dXc1TWQ1UDJRR2pqdG53dUxlY3pBQlZac21vYnpEU25tOGlleHVMSGd4V3E0Zm0zIn19',
      ],
      nonSerializedSlice => ({
        type: PaymentType.Donation,
        desiredAmount: undefined,
        desiredAsset: undefined,
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/donation/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/donation/cancel'),
        signature: {
          signingPublicKey: 'edpkvNZC2djpu424u2zWCmysv7yF1343tVW5pKSjQQziTUtPzJYxg6',
          client: 'edsigu6zZ54Yhiqi3JfwiXQUhLDL3U6MbNHWi1uwD6SReUPcsszuw5Md5P2QGjjtnwuLeczABVZsmobzDSnm8iexuLHgxWq4fm3'
        },
        ...nonSerializedSlice
      })
    ]
  ];

export default validSerializedDonationTestCases;
