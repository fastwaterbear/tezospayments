import { TezosPaymentsOptions } from '../../../src';
import { tezosPaymentsOptionsValidationErrors } from '../../../src/validationErrors';
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
    [tezosPaymentsOptionsValidationErrors.invalidSigningOption]
  ],
  [
    'Empty signing option',
    {
      ...tezosPaymentsOptionsBase,
      signing: {}
    },
    [tezosPaymentsOptionsValidationErrors.invalidSigningOption]
  ],
  [
    'Invalid signing option',
    {
      ...tezosPaymentsOptionsBase,
      signing: 'secret key'
    },
    [tezosPaymentsOptionsValidationErrors.invalidSigningOption]
  ],
  [
    'API secret key has an invalid type, undefined',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: undefined
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidApiSecretKeyType]
  ],
  [
    'API secret key has an invalid type, null',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: null
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidApiSecretKeyType]
  ],
  [
    'API secret key has an invalid type, number',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: 10
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidApiSecretKeyType]
  ],
  [
    'API secret key has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: () => 'secret key'
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidApiSecretKeyType]
  ],
  [
    'API secret key is empty',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        apiSecretKey: ''
      }
    },
    [tezosPaymentsOptionsValidationErrors.emptyApiSecretKey]
  ],
  [
    'WalletSigning function has an invalid type, string',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        walletSigning: 'secret key'
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidWalletSigningOptionType]
  ],
  [
    'WalletSigning function has an invalid type, object',
    {
      ...tezosPaymentsOptionsBase,
      signing: {
        walletSigning: {
          sign: (dataBytes: string) => Promise.resolve(dataBytes)
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidWalletSigningOptionType]
  ]
];

export default invalidSigningTestCases;
