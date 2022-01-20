import { PaymentUrlType, TezosPaymentsOptions } from '../../../src';
import { TezosPaymentsOptionsValidator } from '../../../src/validation';
import { NegativeTestCases } from './testCase';
import validTezosPaymentsOptionsTestCases from './validTezosPaymentsOptionsTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidTezosPaymentsOptionsSlice = { defaultPaymentParameters?: any };

const tezosPaymentsOptionsBase: TezosPaymentsOptions & InvalidTezosPaymentsOptionsSlice = {
  ...validTezosPaymentsOptionsTestCases[0]![1]
};
delete tezosPaymentsOptionsBase.defaultPaymentParameters;

export const invalidDefaultPaymentParametersTestCases: NegativeTestCases<InvalidTezosPaymentsOptionsSlice> = [
  [
    'Default payment parameters has an invalid type, string',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: 'parameters',
    },
    [TezosPaymentsOptionsValidator.errors.invalidDefaultPaymentParameters]
  ],
  [
    'Default payment parameters has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: () => ({}),
    },
    [TezosPaymentsOptionsValidator.errors.invalidDefaultPaymentParameters]
  ],
  [
    'Url type is invalid',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        urlType: undefined
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidUrlType],
  ],
  [
    'Url type has an invalid type, number',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        urlType: 10,
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidUrlType],
  ],
  [
    'Url type has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        urlType: () => PaymentUrlType.Base64
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidUrlType],
  ]
];

export default invalidDefaultPaymentParametersTestCases;
