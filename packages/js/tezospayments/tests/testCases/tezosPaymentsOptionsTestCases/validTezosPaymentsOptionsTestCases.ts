import { PaymentUrlType } from '../../../src';
import { testWalletSigner } from '../../testHelpers';
import { PositiveTestCases } from './testCase';

const apiSecretKey = 'edskRhDErWq9zFCNs8QAEvvV5vU9QLrzwdXhsHkB3r5dn1xEE2rRV1keXCEXkzbEXr12kNGR6An5mEUjtt5yPgB1mwNketg6c4';

const validTezosPaymentsOptionsTestCases: PositiveTestCases = [
  [
    'Simple options with API key',
    {
      serviceContractAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
      signing: {
        apiSecretKey
      }
    },
  ],
  [
    'Simple options with wallet signing',
    {
      serviceContractAddress: 'KT1CgrsR3mctUE6ww3B5mq4cjpDfmUnJSdNh',
      signing: {
        wallet: {
          signingPublicKey: testWalletSigner.publicKey,
          sign: testWalletSigner.sign
        }
      }
    }
  ],
  [
    'With default network definition',
    {
      serviceContractAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
      signing: {
        apiSecretKey
      },
      network: {
        name: 'local'
      }
    }
  ],
  [
    'Empty default payment parameters',
    {
      serviceContractAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
      signing: {
        apiSecretKey
      },
      defaultPaymentParameters: {}
    }
  ],
  [
    'With default url type definition',
    {
      serviceContractAddress: 'KT1Ni4pYV3UGWcDp7MgR5prgcD4NCK1MpXiR',
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

