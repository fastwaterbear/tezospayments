import { PaymentUrlType, TezosPaymentsOptions } from '../../../src';
import { tezosPaymentsOptionsValidationErrors } from '../../../src/validationErrors';
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
    [tezosPaymentsOptionsValidationErrors.invalidDefaultPaymentParameters]
  ],
  [
    'Default payment parameters has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: () => ({}),
    },
    [tezosPaymentsOptionsValidationErrors.invalidDefaultPaymentParameters]
  ],
  [
    'Network is invalid. The network without a name',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'NetLocal',
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.emptyNetworkName],
  ],
  [
    'Network is invalid. The network name is empty',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'NetLocal',
          name: ''
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.emptyNetworkName],
  ],
  [
    'Network is invalid. The network name has an invalid type, number',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'NetLocal',
          name: 11
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkName],
  ],
  [
    'Network is invalid. The network name has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'NetLocal',
          name: () => 'network name'
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkName],
  ],
  [
    'Network is invalid. The network name has invalid characters: -',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'NetLocal',
          name: 'local-network'
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkName],
  ],
  [
    'Network is invalid. The network name has invalid characters: <, >',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'NetLocal',
          name: '<local-network>'
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkName],
  ],
  [
    'Network is invalid. The network name has invalid characters: (, )',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'NetLocal',
          name: 'alert(1)'
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkName],
  ],
  [
    'Network is invalid. The network id has an invalid type, number',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 11,
          name: 'localnetwork'
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkId],
  ],
  [
    'Network is invalid. The network id has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: () => 'NetLocal',
          name: 'localnetwork'
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkId],
  ],
  [
    'Network is invalid. The network id has invalid characters: -',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'local-network',
          name: 'localnetwork'
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkId],
  ],
  [
    'Network is invalid. The network id has invalid characters: <, >',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: '<local-network>',
          name: 'localnetwork'
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkId],
  ],
  [
    'Network is invalid. The network id has invalid characters: (, )',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        network: {
          id: 'alert(1)',
          name: 'localnetwork',
        }
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidNetworkId],
  ],
  [
    'Url type is invalid',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        urlType: undefined
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidUrlType],
  ],
  [
    'Url type has an invalid type, number',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        urlType: 10,
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidUrlType],
  ],
  [
    'Url type has an invalid type, function',
    {
      ...tezosPaymentsOptionsBase,
      defaultPaymentParameters: {
        urlType: () => PaymentUrlType.Base64
      }
    },
    [tezosPaymentsOptionsValidationErrors.invalidUrlType],
  ]
];

export default invalidDefaultPaymentParametersTestCases;
