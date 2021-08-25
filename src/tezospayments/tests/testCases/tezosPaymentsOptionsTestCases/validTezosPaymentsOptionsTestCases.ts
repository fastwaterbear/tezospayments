import { PaymentUrlType } from '../../../src';
import { testWalletSigner } from '../../testHelpers';
import { PositiveTestCases } from './testCase';

const apiSecretKey = 'edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4';

const validTezosPaymentsOptionsTestCases: PositiveTestCases = [
  [
    'Simple options with API key',
    {
      serviceContractAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      signing: {
        apiSecretKey
      }
    },
  ],
  [
    'Simple options with wallet signing',
    {
      serviceContractAddress: 'KT1UmBbUKwsuHwmjGJ2GHSYbVLoJXVcvjMCa',
      signing: {
        walletSigning: testWalletSigner.sign
      }
    }
  ],
  [
    'Empty default payment parameters',
    {
      serviceContractAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      signing: {
        apiSecretKey
      },
      defaultPaymentParameters: {}
    }
  ],
  [
    'With default network definition',
    {
      serviceContractAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      signing: {
        apiSecretKey
      },
      defaultPaymentParameters: {
        network: {
          name: 'local'
        }
      }
    }
  ],
  [
    'With default url type definition',
    {
      serviceContractAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      signing: {
        apiSecretKey
      },
      defaultPaymentParameters: {
        urlType: PaymentUrlType.Base64
      }
    }
  ],
];

export default validTezosPaymentsOptionsTestCases;

