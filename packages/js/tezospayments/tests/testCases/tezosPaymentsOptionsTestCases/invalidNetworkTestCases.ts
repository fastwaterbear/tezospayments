import { TezosPaymentsOptions } from '../../../src';
import { TezosPaymentsOptionsValidator } from '../../../src/validation';
import { NegativeTestCases } from './testCase';
import validTezosPaymentsOptionsTestCases from './validTezosPaymentsOptionsTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidTezosPaymentsOptionsSlice = { network?: any };

const tezosPaymentsOptionsBase: TezosPaymentsOptions & InvalidTezosPaymentsOptionsSlice = {
  ...validTezosPaymentsOptionsTestCases[0]![1]
};
delete tezosPaymentsOptionsBase.network;

export const invalidNetworkTestCases: NegativeTestCases<InvalidTezosPaymentsOptionsSlice> = [
  [
    'The network without a name',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: 'NetLocal',
      }
    },
    [TezosPaymentsOptionsValidator.errors.emptyNetworkName],
  ],
  [
    'The network name is empty',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: 'NetLocal',
        name: ''
      }
    },
    [TezosPaymentsOptionsValidator.errors.emptyNetworkName],
  ],
  [
    'The network name has an invalid type, number',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: 'NetLocal',
        name: 11
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkName],
  ],
  [
    'The network name has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase, network: {
        id: 'NetLocal',
        name: () => 'network name'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkName],
  ],
  [
    'The network name has invalid characters: -',
    {
      ...tezosPaymentsOptionsBase, network: {
        id: 'NetLocal',
        name: 'local-network'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkName],
  ],
  [
    'The network name has invalid characters: <, >',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: 'NetLocal',
        name: '<local-network>'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkName],
  ],
  [
    'The network name has invalid characters: (, )',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: 'NetLocal',
        name: 'alert(1)'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkName],
  ],
  [
    'The network id has an invalid type, number',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: 11,
        name: 'localnetwork'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkId],
  ],
  [
    'The network id has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: () => 'NetLocal',
        name: 'localnetwork'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkId],
  ],
  [
    'The network id has invalid characters: -',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: 'local-network',
        name: 'localnetwork'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkId],
  ],
  [
    'The network id has invalid characters: <, >',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: '<local-network>',
        name: 'localnetwork'
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkId],
  ],
  [
    'The network id has invalid characters: (, )',
    {
      ...tezosPaymentsOptionsBase,
      network: {
        id: 'alert(1)',
        name: 'localnetwork',
      }
    },
    [TezosPaymentsOptionsValidator.errors.invalidNetworkId],
  ]
];

export default invalidNetworkTestCases;
