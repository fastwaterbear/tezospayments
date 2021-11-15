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
        orderId: '103438436'
      }
    },
    {
      type: PaymentType.Payment,
      targetAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
      id: 'NqOzqsdqBQ_ajB0Hh2p7L',
      amount: new BigNumber(17.17),
      data: {
        orderId: '103438436'
      },
      created: new Date('2021-08-31T11:20:23.017Z'),
      signature: {
        signingPublicKey: 'edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s',
        contract: 'edsigtcvjWD22JnGknYDcjncQjmqRsbdGygeUiVA4jofA2YKHACv8qmWXiXMfwFsB3nNjrVmFQfX5S4wWE1s4R3zdEsc6KJfTP6',
      },
      url: 'https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment?network=granadanet#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjE3IiwiZCI6eyJvcmRlcklkIjoiMTAzNDM4NDM2In0sImMiOjE2MzA0MDg4MjMwMTcsInMiOnsiayI6ImVkcGt1UzRuNU1acWhSYmhxZFFObUo1VFRuR0ZmWVdCUmVGOHBTYWdvbUZ5RGtwRFJjMVQ2cyIsImMiOiJlZHNpZ3RjdmpXRDIySm5Ha25ZRGNqbmNRam1xUnNiZEd5Z2VVaVZBNGpvZkEyWUtIQUN2OHFtV1hpWE1md0ZzQjNuTmpyVm1GUWZYNVM0d1dFMXM0UjN6ZEVzYzZLSmZUUDYifX0'
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
        order: {
          id: 'd75fe06b-9288-412d-821b-ca06cd9c7e38'
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
        order: {
          id: 'd75fe06b-9288-412d-821b-ca06cd9c7e38'
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
      url: 'https://payment.tezospayments.com/KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR/payment?network=granadanet#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjUwMCIsImQiOnsib3JkZXIiOnsiaWQiOiJkNzVmZTA2Yi05Mjg4LTQxMmQtODIxYi1jYTA2Y2Q5YzdlMzgifX0sInN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9zdWNjZXNzIiwiY3UiOiJodHRwczovL2Zhc3R3YXRlcmJlYXIuY29tL3Rlem9zcGF5bWVudHMvdGVzdC9wYXltZW50L2NhbmNlbCIsImMiOjE2MzA0MTAwMDEwMDAsInMiOnsiayI6ImVkcGt1UzRuNU1acWhSYmhxZFFObUo1VFRuR0ZmWVdCUmVGOHBTYWdvbUZ5RGtwRFJjMVQ2cyIsImMiOiJlZHNpZ3RkYkdSNjdEd2hSYnRqaTlzRDlaaG1UYWMyMTJUc0RYTlJEOGg2ZDJQckpqejNRYVo4dEpUMVlhZFpWa2E1TUY0V0ZXSHNQTThXTDhDQTZ6U1Z1bWQxdHlZcVBLdUEiLCJjbCI6ImVkc2lndGdkWkRhNXo5cWFvdkJtNkFMdzdyeEh4aTJocjk4YTNIeXA5eEV5dmdGd1BNdWJNZmhYbjRLVk5tV1JtWWRrTktycW1ObnNEOGQzcDZYUEJ2TXVXZTRIdFlnUjR5SiJ9fQ'
    }
  ],
  [
    'Payment in asset tokens (FA 1.2)',
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
        order: {
          id: 'd75fe06b-9288-412d-821b-ca06cd9c7e38',
          itemsCount: 11
        }
      },
      asset: {
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
        decimals: 11,
        id: null
      }
    },
    {
      type: PaymentType.Payment,
      targetAddress: 'KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh',
      id: '2mcIVPiQ9zLnlZ-AFORvD',
      amount: new BigNumber('2323232443343433743.4393343544'),
      asset: {
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
        decimals: 11,
        id: null
      },
      data: {
        order: {
          id: 'd75fe06b-9288-412d-821b-ca06cd9c7e38',
          itemsCount: 11
        }
      },
      created: new Date('2021-09-03T10:18:23.017Z'),
      signature: {
        signingPublicKey: 'edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s',
        contract: 'edsigtd4BTonwv4DRCRtdpqHipCL14JUQbp9xaKidU7JZG7nCyE4tzTc2d75SyEw9qohvZocsbvgD97q8KaiKNxr8s5L2Cb5ryz',
      },
      url: 'https://payment.tezospayments.com/KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh/payment?network=granadanet#00eyJpIjoiMm1jSVZQaVE5ekxubFotQUZPUnZEIiwiYSI6IjIzMjMyMzI0NDMzNDM0MzM3NDMuNDM5MzM0MzU0NCIsImFzIjp7ImEiOiJLVDFNbjJIVVVLVVBnOHdpUWhVSjhaOWpVdFpMYVpuOEVXTDIiLCJkIjoxMX0sImQiOnsib3JkZXIiOnsiaWQiOiJkNzVmZTA2Yi05Mjg4LTQxMmQtODIxYi1jYTA2Y2Q5YzdlMzgiLCJpdGVtc0NvdW50IjoxMX19LCJjIjoxNjMwNjY0MzAzMDE3LCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd0ZDRCVG9ud3Y0RFJDUnRkcHFIaXBDTDE0SlVRYnA5eGFLaWRVN0paRzduQ3lFNHR6VGMyZDc1U3lFdzlxb2h2Wm9jc2J2Z0Q5N3E4S2FpS054cjhzNUwyQ2I1cnl6In19'
    }
  ],
  [
    'Payment in asset tokens (FA 2)',
    {
      serviceContractAddress: 'KT1U2v9pECyE62NgZcYeJi4cdLKWTeiagugA',
      signing: {
        apiSecretKey
      }
    },
    {
      id: 'E-aV1ZvjAP6qVCHzYnSA_',
      amount: '94329423853995395305305',
      asset: {
        address: 'KT1DjUcNtz8pY2xL2HHfzc2Q3k9RnMuPBmV8',
        decimals: 0,
        id: null
      }
    },
    {
      type: PaymentType.Payment,
      targetAddress: 'KT1U2v9pECyE62NgZcYeJi4cdLKWTeiagugA',
      id: 'E-aV1ZvjAP6qVCHzYnSA_',
      amount: new BigNumber('94329423853995395305305'),
      asset: {
        address: 'KT1DjUcNtz8pY2xL2HHfzc2Q3k9RnMuPBmV8',
        decimals: 0,
        id: null
      },
      created: new Date('2021-09-03T10:18:23.017Z'),
      signature: {
        signingPublicKey: 'edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s',
        contract: 'edsigth9Ctb7NBsXki5vfi7pfQmDSuCQk9QwFD6X2hc43ZejD8pqyyahuQ18XJGSq53HwPLf3tE5dQhk17pe5a1tEmctZn8griQ',
      },
      url: 'https://payment.tezospayments.com/KT1U2v9pECyE62NgZcYeJi4cdLKWTeiagugA/payment?network=granadanet#00eyJpIjoiRS1hVjFadmpBUDZxVkNIelluU0FfIiwiYSI6IjkuNDMyOTQyMzg1Mzk5NTM5NTMwNTMwNWUrMjIiLCJhcyI6eyJhIjoiS1QxRGpVY050ejhwWTJ4TDJISGZ6YzJRM2s5Um5NdVBCbVY4IiwiZCI6MH0sImMiOjE2MzA2NjQzMDMwMTcsInMiOnsiayI6ImVkcGt1UzRuNU1acWhSYmhxZFFObUo1VFRuR0ZmWVdCUmVGOHBTYWdvbUZ5RGtwRFJjMVQ2cyIsImMiOiJlZHNpZ3RoOUN0YjdOQnNYa2k1dmZpN3BmUW1EU3VDUWs5UXdGRDZYMmhjNDNaZWpEOHBxeXlhaHVRMThYSkdTcTUzSHdQTGYzdEU1ZFFoazE3cGU1YTF0RW1jdFpuOGdyaVEifX0'
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
      asset: {
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
        decimals: 17,
        id: 1,
      },
      created: new Date('2021-09-03T23:23:00.000Z').getTime(),
      expired: new Date('2021-09-03T23:40:00.000Z').getTime(),
    },
    {
      type: PaymentType.Payment,
      targetAddress: 'KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh',
      id: '04b7a527-65b8-49ef-b8df-cb5d3ecdae07',
      amount: new BigNumber('0.232932843438438'),
      asset: {
        address: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2',
        decimals: 17,
        id: 1,
      },
      created: new Date('2021-09-03T23:23:00.000Z'),
      expired: new Date('2021-09-03T23:40:00.000Z'),
      signature: {
        signingPublicKey: 'edpkuS4n5MZqhRbhqdQNmJ5TTnGFfYWBReF8pSagomFyDkpDRc1T6s',
        contract: 'edsigtwjusdPHpe13gtsAzwUUTvMfgPgHBKWNjEnWXUxtV4rYEnrbdgjfQbrtUXujfyTxTTkvQvPZduvYbcxfs4uMGqrB9quEvS',
      },
      url: 'https://payment.tezospayments.com/KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh/payment?network=granadanet#00eyJpIjoiMDRiN2E1MjctNjViOC00OWVmLWI4ZGYtY2I1ZDNlY2RhZTA3IiwiYSI6IjAuMjMyOTMyODQzNDM4NDM4IiwiYXMiOnsiYSI6IktUMU1uMkhVVUtVUGc4d2lRaFVKOFo5alV0WkxhWm44RVdMMiIsImQiOjE3LCJpIjoxfSwiYyI6MTYzMDcxMTM4MDAwMCwiZSI6MTYzMDcxMjQwMDAwMCwicyI6eyJrIjoiZWRwa3VTNG41TVpxaFJiaHFkUU5tSjVUVG5HRmZZV0JSZUY4cFNhZ29tRnlEa3BEUmMxVDZzIiwiYyI6ImVkc2lndHdqdXNkUEhwZTEzZ3RzQXp3VVVUdk1mZ1BnSEJLV05qRW5XWFV4dFY0cllFbnJiZGdqZlFicnRVWHVqZnlUeFRUa3ZRdlBaZHV2WWJjeGZzNHVNR3FyQjlxdUV2UyJ9fQ'
    }
  ]
];

export default validPaymentTestCases;
