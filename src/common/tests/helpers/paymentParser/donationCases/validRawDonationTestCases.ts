/* eslint-disable max-len */
import { BigNumber } from 'bignumber.js';

import type { NonIncludedDonationFields, RawDonation } from '../../../../src/helpers/paymentParser/donationParser';
import type { Donation } from '../../../../src/models/payment';
import { URL } from '../../../../src/native';

const createdDate = new Date('2021-07-19T05:27:33.011Z');

const cases: ReadonlyArray<readonly [
  message: string | null,
  rawDonation: readonly [obj: RawDonation, serialized: string],
  expectedDonationFactory: (nonIncludedDonationFields: NonIncludedDonationFields) => Donation
]> = [
    [
      'simple donation',
      [
        {
          amount: '384803.383202',
          created: createdDate,
        },
        'eyJhbW91bnQiOiIzODQ4MDMuMzgzMjAyIiwiY3JlYXRlZCI6IjIwMjEtMDctMTlUMDU6Mjc6MzMuMDExWiJ9',
      ],
      nonIncludedFields => ({
        amount: new BigNumber('384803.383202'),
        created: createdDate,
        asset: undefined,
        successUrl: undefined,
        cancelUrl: undefined,
        expired: undefined,
        ...nonIncludedFields
      })
    ],
    [
      'donation in Kolibri USD',
      [
        {
          amount: '8383.383202283822832232',
          created: createdDate,
          asset: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
          successUrl: 'https://fastwaterbear.com/tezospayments/test/donation/success',
          cancelUrl: 'https://fastwaterbear.com/tezospayments/test/donation/cancel',
        },
        'eyJhbW91bnQiOiI4MzgzLjM4MzIwMjI4MzgyMjgzMjIzMiIsImNyZWF0ZWQiOiIyMDIxLTA3LTE5VDA1OjI3OjMzLjAxMVoiLCJhc3NldCI6IktUMUs5Z0NSZ2FMUkZLVEVyWXQxd1Z4QTNGcmI5Rmphc2pUViIsInN1Y2Nlc3NVcmwiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9kb25hdGlvbi9zdWNjZXNzIiwiY2FuY2VsVXJsIjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvZG9uYXRpb24vY2FuY2VsIn0=',
      ],
      nonIncludedFields => ({
        amount: new BigNumber('8383.383202283822832232'),
        created: createdDate,
        asset: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV',
        successUrl: new URL('https://fastwaterbear.com/tezospayments/test/donation/success'),
        cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/donation/cancel'),
        expired: undefined,
        ...nonIncludedFields
      })
    ]
  ];

export default cases;
