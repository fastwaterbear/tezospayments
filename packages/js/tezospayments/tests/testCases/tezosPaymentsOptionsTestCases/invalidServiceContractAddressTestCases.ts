import { TezosPaymentsOptions } from '../../../src';
import { TezosPaymentsOptionsValidator } from '../../../src/validation';
import { NegativeTestCases } from './testCase';
import validTezosPaymentsOptionsTestCases from './validTezosPaymentsOptionsTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidTezosPaymentsOptionsSlice = { serviceContractAddress: any };

const tezosPaymentsOptionsBase: TezosPaymentsOptions & InvalidTezosPaymentsOptionsSlice = {
  ...validTezosPaymentsOptionsTestCases[0]![1]
};
delete tezosPaymentsOptionsBase.serviceContractAddress;

export const invalidServiceContractAddressTestCases: NegativeTestCases<InvalidTezosPaymentsOptionsSlice> = [
  [
    'The service contract address is null',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: null
    },
    [TezosPaymentsOptionsValidator.errors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address is another type: function',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: () => console.log('serviceContractAddress')
    },
    [TezosPaymentsOptionsValidator.errors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address is another type: object',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: {}
    },
    [TezosPaymentsOptionsValidator.errors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address is another type: array',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    [TezosPaymentsOptionsValidator.errors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address is an empty string',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: ''
    },
    [TezosPaymentsOptionsValidator.errors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address has only a prefix',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'KT'
    },
    [TezosPaymentsOptionsValidator.errors.serviceContractAddressHasInvalidLength]
  ],
  [
    'The length of the service contract address is less than normal',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
    },
    [TezosPaymentsOptionsValidator.errors.serviceContractAddressHasInvalidLength]
  ],
  [
    'The length of the service contract address is more than normal',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
    },
    [TezosPaymentsOptionsValidator.errors.serviceContractAddressHasInvalidLength]
  ],
  [
    'The service contract address is an implicit account',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
    },
    [TezosPaymentsOptionsValidator.errors.serviceContractAddressIsNotContractAddress]
  ],
  [
    'The service contract address has an invalid prefix',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    [TezosPaymentsOptionsValidator.errors.serviceContractAddressIsNotContractAddress]
  ]
];

export default invalidServiceContractAddressTestCases;
