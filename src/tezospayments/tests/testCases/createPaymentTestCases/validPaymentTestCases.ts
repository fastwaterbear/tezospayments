/* eslint-disable max-len */
import { URL } from 'url';

import BigNumber from 'bignumber.js';

import { PaymentType } from '@tezospayments/common/src';

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
      amount: new BigNumber(17.17),
      data: {
        public: {
          orderId: '103438436'
        }
      },
      created: new Date('2021-08-31T11:20:23.017Z'),
      url: 'https://payment.tezospayments.com/payment?network=granadanet#00eyJhIjoiMTcuMTciLCJkIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMTAzNDM4NDM2In19LCJjIjoxNjMwNDA4ODIzMDE3fQ'
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
      amount: new BigNumber(500),
      data: {
        public: {
          orderId: 'd75fe06b-9288-412d-821b-ca06cd9c7e38'
        }
      },
      created: new Date('2021-08-31T11:40:01.000Z'),
      successUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/success'),
      cancelUrl: new URL('https://fastwaterbear.com/tezospayments/test/payment/cancel'),
      url: 'https://payment.tezospayments.com/payment?network=granadanet#00eyJhIjoiNTAwIiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6ImQ3NWZlMDZiLTkyODgtNDEyZC04MjFiLWNhMDZjZDljN2UzOCJ9fSwic3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L3N1Y2Nlc3MiLCJjdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvY2FuY2VsIiwiYyI6MTYzMDQxMDAwMTAwMH0'
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
      amount: new BigNumber('2323232443343433743.4393343544'),
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
      data: {
        public: {
          orderId: 'ae90813d3def46c1aa69750e513b603c'
        }
      },
      created: new Date('2021-09-03T10:18:23.017Z'),
      url: 'https://payment.tezospayments.com/payment?network=granadanet#00eyJhIjoiMjMyMzIzMjQ0MzM0MzQzMzc0My40MzkzMzQzNTQ0IiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6ImFlOTA4MTNkM2RlZjQ2YzFhYTY5NzUwZTUxM2I2MDNjIn19LCJhcyI6IktUMU1uMkhVVUtVUGc4d2lRaFVKOFo5alV0WkxhWm44RVdMMiIsImMiOjE2MzA2NjQzMDMwMTd9'
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
      amount: new BigNumber('0.232932843438438'),
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
      data: {
        public: {
          orderId: '0293'
        }
      },
      created: new Date('2021-09-03T23:23:00.000Z'),
      expired: new Date('2021-09-03T23:40:00.000Z'),
      url: 'https://payment.tezospayments.com/payment?network=granadanet#00eyJhIjoiMC4yMzI5MzI4NDM0Mzg0MzgiLCJkIjp7InB1YmxpYyI6eyJvcmRlcklkIjoiMDI5MyJ9fSwiYXMiOiJLVDFNbjJIVVVLVVBnOHdpUWhVSjhaOWpVdFpMYVpuOEVXTDIiLCJjIjoxNjMwNzExMzgwMDAwLCJlIjoxNjMwNzEyNDAwMDAwfQ'
    }
  ]
];

export default validPaymentTestCases;
