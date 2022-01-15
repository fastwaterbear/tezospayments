import { TezosPaymentsOptions } from '../../../src';
import { TezosPaymentsOptionsValidator } from '../../../src/validation';
import { testWalletSigner } from '../../testHelpers';
import { NegativeTestCases } from './testCase';
import validTezosPaymentsOptionsTestCases from './validTezosPaymentsOptionsTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidTezosPaymentsOptionsSlice = { signing: any };

const tezosPaymentsOptionsBase: TezosPaymentsOptions & InvalidTezosPaymentsOptionsSlice = {
  ...validTezosPaymentsOptionsTestCases[0]![1]
};
delete tezosPaymentsOptionsBase.signing;

export const invalidSigningTestCases: NegativeTestCases<InvalidTezosPaymentsOptionsSlice> = [
  [
    'No signing option',
    {
      ...tezosPaymentsOptionsBase,
    },
    [TezosPaymentsOptionsValidator.errors.invalidSigningOption]
  ],
  [
    'Empty signing option',
    {
      ...tezosPaymentsOptionsBase,
      signing: {}
    },
    [TezosPaymentsOptionsValidator.errors.invalidSigningOption]
  ],
  [
    'Invalid signing option',
    {
      ...tezosPaymentsOptionsBase,
      signing: 'secret key'
    },
    [TezosPaymentsOptionsValidator.errors.invalidSigningOption]
  ],
  [
    'API secret key has an invalid type, undefined',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: undefined
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidApiSecretKeyType]
  ],
  [
    'API secret key has an invalid type, null',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: null
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidApiSecretKeyType]
  ],
  [
    'API secret key has an invalid type, number',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: 10
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidApiSecretKeyType]
  ],
  [
    'API secret key has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: () => 'secret key'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidApiSecretKeyType]
  ],
  [
    'API secret key is empty',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: ''
      }
    },
    [TezosPaymentsOptionsValidator.errors.emptyApiSecretKey]
  ],
  [
    'Wallet options has an invalid type, string',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: 'secret key'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidWalletSigningOption]
  ],
  [
    'Wallet options has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: () => 'fake signature'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidWalletSigningOption]
  ],
  [
    'Wallet sign function is missed',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: {
          signingPublicKey: testWalletSigner.publicKey
        }
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidWalletSignFunctionType]
  ],
  [
    'Wallet signing public key is missed',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: {
          sign: () => testWalletSigner.sign
        }
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidWalletSigningPublicKey]
  ],
  [
    'Wallet sign function has an invalid type, null',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: {
          signingPublicKey: testWalletSigner.publicKey,
          sign: null,
        }
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidWalletSignFunctionType]
  ],
  [
    'Wallet sign function has an invalid type, object',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: {
          signingPublicKey: testWalletSigner.publicKey,
          sign: {
            sign: (dataBytes: string) => Promise.resolve(dataBytes),
          },
        }
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidWalletSignFunctionType]
  ],
  [
    'Wallet signing public key is empty',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: {
          signingPublicKey: '',
          sign: testWalletSigner.sign
        }
      }
    },
    [TezosPaymentsOptionsValidator.errors.emptyWalletSigningPublicKey]
  ],
  [
    'Wallet signing public key has an invalid type, object',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: {
          signingPublicKey: { secret: testWalletSigner.secretKey, public: testWalletSigner.publicKey },
          sign: testWalletSigner.sign
        }
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidWalletSigningPublicKey]
  ],
  [
    'Wallet signing public key has an invalid type, array',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        wallet: {
          signingPublicKey: [0, 1, 2, 3, 4, 5],
          sign: testWalletSigner.sign
        }
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidWalletSigningPublicKey]
  ],
  [
    'Custom sign function has an invalid type, string',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        custom: 'secret key'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidCustomSigningOption]
  ],
  [
    'Custom sign function has an invalid type, object',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        custom: {
          signingPublicKey: [0, 1, 2, 3, 4, 5],
          sign: testWalletSigner.sign
        }
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidCustomSigningOption]
  ]
];

export default invalidSigningTestCases;
