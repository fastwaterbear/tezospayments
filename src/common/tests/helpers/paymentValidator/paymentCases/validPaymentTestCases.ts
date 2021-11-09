import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { Payment, PaymentType } from '../../../../src/models';

export default [
  {
    type: PaymentType.Payment,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    id: 'fe1347f3a57f415f8c1a9879f7a4a634',
    amount: new BigNumber(384.48302),
    data: {
      order: {
        id: 'o:38849203'
      }
    },
    successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
    created: new Date('2021-07-04T00:17:23.043Z'),
    signature: {
      signingPublicKey: 'edpkvNZC2djpu424u2zWCmysv7yF1343tVW5pKSjQQziTUtPzJYxg6',
      contract: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
      client: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
    },
  },
  {
    type: PaymentType.Payment,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    id: '2b785483ac3b4ce192f8e5d45601496f',
    amount: new BigNumber(20238382),
    data: {
      orderId: 'da242e2b-6a2b-4066-bad1-2479fa947c54'
    },
    asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
    successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
    created: new Date('2021-07-05T10:21:01.111Z'),
    signature: {
      signingPublicKey: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
      contract: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
      client: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
    },
  },
  {
    type: PaymentType.Payment,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    id: '0333c2ba-7c2a-4c69-9663-d63af6bb3495',
    amount: new BigNumber(67.49),
    data: {
      order: {
        id: '67fedcf8-3bfc-458f-aa66-4635adafb669'
      },
      items: [
        { id: 0, title: 'Item 1' },
        { id: 1, title: 'Item 2' },
        { id: 2, title: 'Item 3' },
      ]
    },
    successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
    created: new Date('2021-07-05T10:21:01.111Z'),
    expired: new Date('2021-07-05T10:41:01.111Z'),
    signature: {
      signingPublicKey: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
      contract: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
      client: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
    },
  },
  {
    type: PaymentType.Payment,
    targetAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
    id: '801b87bb-dc46-48f1-a6e9-02823691b5ab',
    amount: new BigNumber(23267.41173),
    successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
    cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
    created: new Date('2021-07-05T10:21:01.111Z'),
    expired: new Date('2021-07-05T10:41:01.111Z'),
    signature: {
      signingPublicKey: 'edpktfQYQXPQB2mecyszBvXSVUz1s3U7ihttiJomFgxYbUHWBji4du',
      contract: 'edsigtsKED6qzvit5rnbDTYE14oUKxwRoZySoPykKaR2A1JwbC2bfnFJzRhjfNnNgD4ubTTurtgBhdKjEdqnhaDysu7MgCJVQ8F',
      client: 'edsigtcFp4PVGnT3ZNTNiPo4GyyRKGZBUba1KnwVyGyGJe32HcSvbGaWSKkWsddRaQCeCTuG3Bm3tK8Gd8nYwiB9bsnMxdfPukZ'
    },
  },
] as readonly Payment[];
