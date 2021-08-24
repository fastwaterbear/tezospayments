import { TezosPaymentsOptions } from '../../../src';
import { tezosPaymentsErrors } from '../../testHelpers';
import { NegativeTestCases } from './testCase';
import validServiceContractAddressTestCases from './validTezosPaymentsOptionsTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidTezosPaymentsOptionsSlice = { serviceContractAddress: any };

const tezosPaymentsOptionsBase: TezosPaymentsOptions & InvalidTezosPaymentsOptionsSlice = {
  ...validServiceContractAddressTestCases[0]![1]
};
delete tezosPaymentsOptionsBase.serviceContractAddress;

export const invalidServiceContractAddressTestCases: NegativeTestCases<InvalidTezosPaymentsOptionsSlice> = [
  [
    'The service contract address is null',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: null
    },
    [tezosPaymentsErrors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address is another type: function',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: () => console.log('serviceContractAddress')
    },
    [tezosPaymentsErrors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address is another type: object',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: {}
    },
    [tezosPaymentsErrors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address is another type: array',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: ['KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2']
    },
    [tezosPaymentsErrors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address is an empty string',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: ''
    },
    [tezosPaymentsErrors.invalidServiceContractAddressType]
  ],
  [
    'The service contract address has only a prefix',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'KT'
    },
    [tezosPaymentsErrors.serviceContractAddressHasInvalidLength]
  ],
  [
    'The length of the service contract address is less than normal',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2Z'
    },
    [tezosPaymentsErrors.serviceContractAddressHasInvalidLength]
  ],
  [
    'The length of the service contract address is more than normal',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'KT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL'
    },
    [tezosPaymentsErrors.serviceContractAddressHasInvalidLength]
  ],
  [
    'The service contract address is an implicit account',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5'
    },
    [tezosPaymentsErrors.serviceContractAddressIsNotContractAddress]
  ],
  [
    'The service contract address has an invalid prefix',
    {
      ...tezosPaymentsOptionsBase,
      serviceContractAddress: 'CT1Mn2HUUKUPg8wiQhUJ8Z9jUtZLaZn8EWL2'
    },
    [tezosPaymentsErrors.serviceContractAddressIsNotContractAddress]
  ]
];

export default invalidServiceContractAddressTestCases;
