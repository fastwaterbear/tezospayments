import { testWalletSigner } from '../../testHelpers';
import { PositiveTestCases } from './testCase';

const validTezosPaymentsOptionsTestCases: PositiveTestCases = [
  [
    'Simple options with API key',
    {
      serviceContractAddress: 'KT1ECFaVQDnA5vYnaVkFc7RdfQVjxvjPHuQn',
      signing: {
        apiSecretKey: 'edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4',
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
  ]
];

export default validTezosPaymentsOptionsTestCases;

