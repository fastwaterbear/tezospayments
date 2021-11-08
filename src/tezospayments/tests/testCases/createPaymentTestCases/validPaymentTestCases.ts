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
      serviceContractAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
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
      targetAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
      id: 'NqOzqsdqBQ_ajB0Hh2p7L',
      amount: new BigNumber(17.17),
      data: {
        public: {
          orderId: '103438436'
        }
      },
      created: new Date('2021-08-31T11:20:23.017Z'),
      signature: {
        signingPublicKey: 'edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s',
        contract: 'edsigtcvjWD22JnGknYDcjncQjmqRsbdGygeUiVA4jofA2YKHACv8qmWXiXMfwFsB3nNjrVmFQfX5S4wWE1s4R3zdEsc6KJfTP6',
      },
      url: 'https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment?network=granadanet#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjE3IiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjEwMzQzODQzNiJ9fSwiYyI6MTYzMDQwODgyMzAxNywicyI6eyJrIjoiZWRwa3VTNG41TVpxaFJiaHFkUU5tSjVUVG5HRmZZV0JSZUY4cFNhZ29tRnlEa3BEUmMxVDZzIiwiYyI6ImVkc2lndGN2aldEMjJKbkdrbllEY2puY1FqbXFSc2JkR3lnZVVpVkE0am9mQTJZS0hBQ3Y4cW1XWGlYTWZ3RnNCM25OanJWbUZRZlg1UzR3V0UxczRSM3pkRXNjNktKZlRQNiJ9fQ'
    }
  ],
  [
    'Payment with application urls',
    {
      serviceContractAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
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
      targetAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
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
      signature: {
        signingPublicKey: 'edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s',
        contract: 'edsigtdbGR67DwhRbtji9sD9ZhmTac212TsDXNRD8h6d2PrJjz3QaZ8tJT1YadZVka5MF4WFWHsPM8WL8CA6zSVumd1tyYqPKuA',
        client: 'edsigtgdZDa5z9qaovBm6ALw7rxHxi2hr98a3Hyp9xEyvgFwPMubMfhXn4KVNmWRmYdkNKrqmNnsD8d3p6XPBvMuWe4HtYgR4yJ'
      },
      url: 'https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment?network=granadanet#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjUwMCIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiJkNzVmZTA2Yi05Mjg4LTQxMmQtODIxYi1jYTA2Y2Q5YzdlMzgifX0sInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MzA0MTAwMDEwMDAsInMiOnsiayI6ImVkcGt1UzRuNU1acWhSYmhxZFFObUo1VFRuR0ZmWVdCUmVGOHBTYWdvbUZ5RGtwRFJjMVQ2cyIsImMiOiJlZHNpZ3RkYkdSNjdEd2hSYnRqaTlzRDlaaG1UYWMyMTJUc0RYTlJEOGg2ZDJQckpqejNRYVo4dEpUMVlhZFpWa2E1TUY0V0ZXSHNQTThXTDhDQTZ6U1Z1bWQxdHlZcVBLdUEiLCJjbCI6ImVkc2lndGdkWkRhNXo5cWFvdkJtNkFMdzdyeEh4aTJocjk4YTNIeXA5eEV5dmdGd1BNdWJNZmhYbjRLVk5tV1JtWWRrTktycW1ObnNEOGQzcDZYUEJ2TXVXZTRIdFlnUjR5SiJ9fQ'
    }
  ],
  [
    'Payment in asset tokens',
    {
      serviceContractAddress: 'KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh',
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
      targetAddress: 'KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh',
      id: '2mcIVPiQ9zLnlZ-AFORvD',
      amount: new BigNumber('2323232443343433743.4393343544'),
      asset: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
      data: {
        public: {
          orderId: 'ae90813d3def46c1aa69750e513b603c'
        }
      },
      created: new Date('2021-09-03T10:18:23.017Z'),
      signature: {
        signingPublicKey: 'edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s',
        contract: 'edsigtgmAw45kpcTFrPLHfzqfhTpFMUW5B8mB4Lpwo2RLYjMZ7uBgbPMkj5sktjjnN8ri7SRTPXUCQnaye5ni1ac8fZhUR9NcNY',
      },
      url: 'https://payment.tezospayments.com/KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh/payment?network=granadanet#00eyJpIjoiMm1jSVZQaVE5ekxubFotQUZPUnZEIiwiYSI6IjIzMjMyMzI0NDMzNDM0MzM3NDMuNDM5MzM0MzU0NCIsImQiOnsicHVibGljIjp7Im9yZGVySWQiOiJhZTkwODEzZDNkZWY0NmMxYWE2OTc1MGU1MTNiNjAzYyJ9fSwiYXMiOiJLVDFNbjJIVVVLVVBnOHdpUWhVSjhaOWpVdFpMYVpuOEVXTDIiLCJjIjoxNjMwNjY0MzAzMDE3LCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd0Z21BdzQ1a3BjVEZyUExIZnpxZmhUcEZNVVc1QjhtQjRMcHdvMlJMWWpNWjd1QmdiUE1rajVza3Rqam5OOHJpN1NSVFBYVUNRbmF5ZTVuaTFhYzhmWmhVUjlOY05ZIn19'
    }
  ],
  [
    'Lifetime payment',
    {
      serviceContractAddress: 'KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh',
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
      targetAddress: 'KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh',
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
      signature: {
        signingPublicKey: 'edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s',
        contract: 'edsigtt8XDL2zA2xz9bDmYKgCc9ryYgtT9G7jQ65V9QR8AGJcGAX6yhYR4teyoaoXinxqqKTF2qBCqHwTmqRpsNdi5RjFZFbDCD',
      },
      url: 'https://payment.tezospayments.com/KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh/payment?network=granadanet#00eyJpIjoiMDRiN2E1MjctNjViOC00OWVmLWI4ZGYtY2I1ZDNlY2RhZTA3IiwiYSI6IjAuMjMyOTMyODQzNDM4NDM4IiwiZCI6eyJwdWJsaWMiOnsib3JkZXJJZCI6IjAyOTMifX0sImFzIjoiS1QxTW4ySFVVS1VQZzh3aVFoVUo4WjlqVXRaTGFabjhFV0wyIiwiYyI6MTYzMDcxMTM4MDAwMCwiZSI6MTYzMDcxMjQwMDAwMCwicyI6eyJrIjoiZWRwa3VTNG41TVpxaFJiaHFkUU5tSjVUVG5HRmZZV0JSZUY4cFNhZ29tRnlEa3BEUmMxVDZzIiwiYyI6ImVkc2lndHQ4WERMMnpBMnh6OWJEbVlLZ0NjOXJ5WWd0VDlHN2pRNjVWOVFSOEFHSmNHQVg2eWhZUjR0ZXlvYW9YaW54cXFLVEYycUJDcUh3VG1xUnBzTmRpNVJqRlpGYkRDRCJ9fQ'
    }
  ]
];

export default validPaymentTestCases;
