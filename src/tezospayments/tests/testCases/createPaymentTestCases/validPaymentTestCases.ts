/* eslint-disable max-len */
import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { PaymentType } from '@tezospayments/common';

import { PositiveTestCases } from './testCase';

const apiSecretKey = 'edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4';

const validPaymentTestCases: PositiveTestCases = [
  [
    'Simple payment',
    {
      serviceContractAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      signing: {
        apiSecretKey
      }
    },
    {
      amount: '17.17',
      data: {
        public: {
          orderId: '103438436'
        }
      }
    },
    {
      type: PaymentType.Payment,
      targetAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      id: 'NqOzqsdqBQ_ajB0Hh2p7L',
      amount: new BigNumber(17.17),
      data: {
        public: {
          orderId: '103438436'
        }
      },
      created: new Date('2021-08-31T11:20:23.017Z'),
      url: 'https://payment.tezospayments.com/KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn/payment?network=granadanet#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjE3IiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjEwMzQzODQzNiJ9fSwiYyI6MTYzMDQwODgyMzAxN30'
    }
  ],
  [
    'Payment with application urls',
    {
      serviceContractAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      signing: {
        apiSecretKey
      }
    },
    {
      amount: '500',
      data: {
        public: {
          orderId: 'd75fe06b-9288-412d-821b-ca06cd9c7e38'
        }
      },
      successUrl: 'https://fastwaterbear.com/tezospayments/test/payment/success',
      cancelUrl: 'https://fastwaterbear.com/tezospayments/test/payment/cancel'
    },
    {
      type: PaymentType.Payment,
      targetAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      id: 'NqOzqsdqBQ_ajB0Hh2p7L',
      amount: new BigNumber(500),
      data: {
        public: {
          orderId: 'd75fe06b-9288-412d-821b-ca06cd9c7e38'
        }
      },
      created: new Date('2021-08-31T11:40:01.000Z'),
      successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
      cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
      url: 'https://payment.tezospayments.com/KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn/payment?network=granadanet#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjUwMCIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiJkNzVmZTA2Yi05Mjg4LTQxMmQtODIxYi1jYTA2Y2Q5YzdlMzgifX0sInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MzA0MTAwMDEwMDB9'
    }
  ],
  [
    'Payment in asset tokens',
    {
      serviceContractAddress: 'KT1UmBbUKwsuHwmjGJ2GHSYbVLoJXVcvjMCa',
      signing: {
        apiSecretKey
      }
    },
    {
      id: '2mcIVPiQ9zLnlZ-AFORvD',
      amount: '2323232443343433743.4393343544',
      data: {
        public: {
          orderId: 'ae90813d3def46c1aa69750e513b603c'
        }
      },
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    {
      type: PaymentType.Payment,
      targetAddress: 'KT1UmBbUKwsuHwmjGJ2GHSYbVLoJXVcvjMCa',
      id: '2mcIVPiQ9zLnlZ-AFORvD',
      amount: new BigNumber('2323232443343433743.4393343544'),
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
      data: {
        public: {
          orderId: 'ae90813d3def46c1aa69750e513b603c'
        }
      },
      created: new Date('2021-09-03T10:18:23.017Z'),
      url: 'https://payment.tezospayments.com/KT1UmBbUKwsuHwmjGJ2GHSYbVLoJXVcvjMCa/payment?network=granadanet#00eyJpIjoiMm1jSVZQaVE5ekxubFotQUZPUnZEIiwiYSI6IjIzMjMyMzI0NDMzNDM0MzM3NDMuNDM5MzM0MzU0NCIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiJhZTkwODEzZDNkZWY0NmMxYWE2OTc1MGU1MTNiNjAzYyJ9fSwiYXMiOiJLVDFNbjJIVVVLVVBnOHdpUWhVSjhaOWpVdFpMYVpuOEVXTDIiLCJjIjoxNjMwNjY0MzAzMDE3fQ'
    }
  ],
  [
    'Lifetime payment',
    {
      serviceContractAddress: 'KT1UmBbUKwsuHwmjGJ2GHSYbVLoJXVcvjMCa',
      signing: {
        apiSecretKey
      }
    },
    {
      id: '04b7a527-65b8-49ef-b8df-cb5d3ecdae07',
      amount: '0.232932843438438',
      data: {
        public: {
          orderId: '0293'
        }
      },
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
      created: new Date('2021-09-03T23:23:00.000Z').getTime(),
      expired: new Date('2021-09-03T23:40:00.000Z').getTime(),
    },
    {
      type: PaymentType.Payment,
      targetAddress: 'KT1UmBbUKwsuHwmjGJ2GHSYbVLoJXVcvjMCa',
      id: '04b7a527-65b8-49ef-b8df-cb5d3ecdae07',
      amount: new BigNumber('0.232932843438438'),
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
      data: {
        public: {
          orderId: '0293'
        }
      },
      created: new Date('2021-09-03T23:23:00.000Z'),
      expired: new Date('2021-09-03T23:40:00.000Z'),
      url: 'https://payment.tezospayments.com/KT1UmBbUKwsuHwmjGJ2GHSYbVLoJXVcvjMCa/payment?network=granadanet#00eyJpIjoiMDRiN2E1MjctNjViOC00OWVmLWI4ZGYtY2I1ZDNlY2RhZTA3IiwiYSI6IjAuMjMyOTMyODQzNDM4NDM4IiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjAyOTMifX0sImFzIjoiS1QxTW4ySFVVS1VQZzh3aVFoVUo4WjlqVXRaTGFabjhFV0wyIiwiYyI6MTYzMDcxMTM4MDAwMCwiZSI6MTYzMDcxMjQwMDAwMH0'
    }
  ]
];

export default validPaymentTestCases;
