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
        contract: 'edsigu3kdsDpZY3TCptADrzLmjk7yjevXyrf73Y2iJiRyhYwQzJFTESghMoozwzuxgWsyT68SoeWL3QHPSVZvQ5uZ56Sixb86fs',
      },
      url: 'https://payment.tezospayments.com/#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjE3IiwidCI6IktUMU5pNHBZVjNVR1djRHA3TWdSNXByZ2NENE5DSzFNcFhpUiIsImQiOnsib3JkZXJJZCI6IjEwMzQzODQzNiJ9LCJjIjoxNjMwNDA4ODIzMDE3LCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd1M2tkc0RwWlkzVENwdEFEcnpMbWprN3lqZXZYeXJmNzNZMmlKaVJ5aFl3UXpKRlRFU2doTW9vend6dXhnV3N5VDY4U29lV0wzUUhQU1ZadlE1dVo1NlNpeGI4NmZzIn19'
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
        contract: 'edsigttPDNZh2rqVKiPg1tVd51BhSWhxV6qMkTuBCzzhP3QiEbrkRggT1HXt83t49SZjbXioxS5FdqNgpGQYa9ajJx2Z4R2WKrE',
        client: 'edsigtgdZDa5z9qaovBm6ALw7rxHxi2hr98a3Hyp9xEyvgFwPMubMfhXn4KVNmWRmYdkNKrqmNnsD8d3p6XPBvMuWe4HtYgR4yJ'
      },
      url: 'https://payment.tezospayments.com/#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjUwMCIsInQiOiJLVDFOaTRwWVYzVUdXY0RwN01nUjVwcmdjRDROQ0sxTXBYaVIiLCJkIjp7Im9yZGVyIjp7ImlkIjoiZDc1ZmUwNmItOTI4OC00MTJkLTgyMWItY2EwNmNkOWM3ZTM4In19LCJzdSI6Imh0dHBzOi8vZmFzdHdhdGVyYmVhci5jb20vdGV6b3NwYXltZW50cy90ZXN0L3BheW1lbnQvc3VjY2VzcyIsImN1IjoiaHR0cHM6Ly9mYXN0d2F0ZXJiZWFyLmNvbS90ZXpvc3BheW1lbnRzL3Rlc3QvcGF5bWVudC9jYW5jZWwiLCJjIjoxNjMwNDEwMDAxMDAwLCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd0dFBETlpoMnJxVktpUGcxdFZkNTFCaFNXaHhWNnFNa1R1QkN6emhQM1FpRWJya1JnZ1QxSFh0ODN0NDlTWmpiWGlveFM1RmRxTmdwR1FZYTlhakp4Mlo0UjJXS3JFIiwiY2wiOiJlZHNpZ3RnZFpEYTV6OXFhb3ZCbTZBTHc3cnhIeGkyaHI5OGEzSHlwOXhFeXZnRndQTXViTWZoWG40S1ZObVdSbVlka05LcnFtTm5zRDhkM3A2WFBCdk11V2U0SHRZZ1I0eUoifX0'
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
      url: 'https://payment.tezospayments.com/#00eyJpIjoiMm1jSVZQaVE5ekxubFotQUZPUnZEIiwiYSI6IjIzMjMyMzI0NDMzNDM0MzM3NDMuNDM5MzM0MzU0NCIsInQiOiJLVDFDZ3JzUjNtY3RVRTZ3dzNCNW1xNGNqcERmbVVuSlNkTmgiLCJhcyI6eyJhIjoiS1QxTW4ySFVVS1VQZzh3aVFoVUo4WjlqVXRaTGFabjhFV0wyIiwiZCI6MTF9LCJkIjp7Im9yZGVyIjp7ImlkIjoiZDc1ZmUwNmItOTI4OC00MTJkLTgyMWItY2EwNmNkOWM3ZTM4IiwiaXRlbXNDb3VudCI6MTF9fSwiYyI6MTYzMDY2NDMwMzAxNywicyI6eyJrIjoiZWRwa3VTNG41TVpxaFJiaHFkUU5tSjVUVG5HRmZZV0JSZUY4cFNhZ29tRnlEa3BEUmMxVDZzIiwiYyI6ImVkc2lndGQ0QlRvbnd2NERSQ1J0ZHBxSGlwQ0wxNEpVUWJwOXhhS2lkVTdKWkc3bkN5RTR0elRjMmQ3NVN5RXc5cW9odlpvY3NidmdEOTdxOEthaUtOeHI4czVMMkNiNXJ5eiJ9fQ'
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
      url: 'https://payment.tezospayments.com/#00eyJpIjoiRS1hVjFadmpBUDZxVkNIelluU0FfIiwiYSI6IjkuNDMyOTQyMzg1Mzk5NTM5NTMwNTMwNWUrMjIiLCJ0IjoiS1QxVTJ2OXBFQ3lFNjJOZ1pjWWVKaTRjZExLV1RlaWFndWdBIiwiYXMiOnsiYSI6IktUMURqVWNOdHo4cFkyeEwySEhmemMyUTNrOVJuTXVQQm1WOCIsImQiOjB9LCJjIjoxNjMwNjY0MzAzMDE3LCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd0aDlDdGI3TkJzWGtpNXZmaTdwZlFtRFN1Q1FrOVF3RkQ2WDJoYzQzWmVqRDhwcXl5YWh1UTE4WEpHU3E1M0h3UExmM3RFNWRRaGsxN3BlNWExdEVtY3RabjhncmlRIn19'
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
      url: 'https://payment.tezospayments.com/#00eyJpIjoiMDRiN2E1MjctNjViOC00OWVmLWI4ZGYtY2I1ZDNlY2RhZTA3IiwiYSI6IjAuMjMyOTMyODQzNDM4NDM4IiwidCI6IktUMUNncnNSM21jdFVFNnd3M0I1bXE0Y2pwRGZtVW5KU2ROaCIsImFzIjp7ImEiOiJLVDFNbjJIVVVLVVBnOHdpUWhVSjhaOWpVdFpMYVpuOEVXTDIiLCJkIjoxNywiaSI6MX0sImMiOjE2MzA3MTEzODAwMDAsImUiOjE2MzA3MTI0MDAwMDAsInMiOnsiayI6ImVkcGt1UzRuNU1acWhSYmhxZFFObUo1VFRuR0ZmWVdCUmVGOHBTYWdvbUZ5RGtwRFJjMVQ2cyIsImMiOiJlZHNpZ3R3anVzZFBIcGUxM2d0c0F6d1VVVHZNZmdQZ0hCS1dOakVuV1hVeHRWNHJZRW5yYmRnamZRYnJ0VVh1amZ5VHhUVGt2UXZQWmR1dlliY3hmczR1TUdxckI5cXVFdlMifX0'
    }
  ],
  [
    'Simple payment in the custom network',
    {
      serviceContractAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
      signing: {
        apiSecretKey
      },
      network: { name: 'mycoolnetwork' }
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
        contract: 'edsigu3kdsDpZY3TCptADrzLmjk7yjevXyrf73Y2iJiRyhYwQzJFTESghMoozwzuxgWsyT68SoeWL3QHPSVZvQ5uZ56Sixb86fs',
      },
      url: 'https://payment.tezospayments.com/?network=mycoolnetwork#00eyJpIjoiTnFPenFzZHFCUV9hakIwSGgycDdMIiwiYSI6IjE3LjE3IiwidCI6IktUMU5pNHBZVjNVR1djRHA3TWdSNXByZ2NENE5DSzFNcFhpUiIsImQiOnsib3JkZXJJZCI6IjEwMzQzODQzNiJ9LCJjIjoxNjMwNDA4ODIzMDE3LCJzIjp7ImsiOiJlZHBrdVM0bjVNWnFoUmJocWRRTm1KNVRUbkdGZllXQlJlRjhwU2Fnb21GeURrcERSYzFUNnMiLCJjIjoiZWRzaWd1M2tkc0RwWlkzVENwdEFEcnpMbWprN3lqZXZYeXJmNzNZMmlKaVJ5aFl3UXpKRlRFU2doTW9vend6dXhnV3N5VDY4U29lV0wzUUhQU1ZadlE1dVo1NlNpeGI4NmZzIn19'
    }
  ],
];

export default validPaymentTestCases;
