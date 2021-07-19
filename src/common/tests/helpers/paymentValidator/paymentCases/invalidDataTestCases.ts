/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentValidator } from '../../../../src/helpers';
import { FailedValidationResults } from '../../../../src/models/validation';
import type { NegativeTestCases } from '../testCase';
import validPaymentTestCases from './validPaymentTestCases';

const validPaymentBase = { ...validPaymentTestCases[0] };
delete validPaymentBase.data;

const validPublicData = {
  orderId: 'o1'
};

const validPrivateData = {
  userId: 'u1'
};

const invalidPublicDataTestCases: NegativeTestCases = [
  [
    {
      ...validPaymentBase,
      data: {
        public: null
      },
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        public: 0
      },
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        public: 'Test'
      },
    },
    [PaymentValidator.errors.invalidPublicData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        public: () => console.log('public data')
      },
    },
    [PaymentValidator.errors.invalidPublicData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        public: {
          ...validPublicData,
          nestedObject: {
            x: 1,
            y: 2
          }
        }
      }
    },
    [PaymentValidator.errors.publicDataShouldBeFlat]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        public: {
          ...validPublicData,
          nestedArray: ['Test0', 'Test1']
        }
      }
    },
    [PaymentValidator.errors.publicDataShouldBeFlat]
  ]
];

const invalidPrivateDataTestCases: NegativeTestCases = [
  [
    {
      ...validPaymentBase,
      data: {
        private: null
      },
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        private: 0
      },
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        private: 'Test'
      },
    },
    [PaymentValidator.errors.invalidPrivateData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        private: () => console.log('private data')
      },
    },
    [PaymentValidator.errors.invalidPrivateData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        private: {
          ...validPrivateData,
          nestedObject: {
            x: 1,
            y: 2
          }
        }
      }
    },
    [PaymentValidator.errors.privateDataShouldBeFlat]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        private: {
          ...validPrivateData,
          nestedArray: ['Test0', 'Test1']
        }
      }
    },
    [PaymentValidator.errors.privateDataShouldBeFlat]
  ]
];

export default [
  [
    validPaymentBase,
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: 'Test'
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: 'Test'
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: {}
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        public: validPublicData,
        excessField: 'excessValue'
      }
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        private: validPrivateData,
        excessField: 'excessValue'
      }
    },
    [PaymentValidator.errors.invalidData]
  ],
  [
    {
      ...validPaymentBase,
      data: {
        public: validPublicData,
        private: validPrivateData,
        excessField: 'excessValue'
      }
    },
    [PaymentValidator.errors.invalidData]
  ],
  ...invalidPublicDataTestCases,
  ...invalidPrivateDataTestCases,
  ...invalidPublicDataTestCases.map(([payment, failedValidationResults]: readonly [any, FailedValidationResults]) => [
    { ...payment, data: { ...payment.data, private: { ...validPrivateData } } },
    failedValidationResults?.[0] === PaymentValidator.errors.invalidData
      ? [PaymentValidator.errors.invalidPublicData]
      : failedValidationResults
  ]),
  ...invalidPrivateDataTestCases.map(([payment, failedValidationResults]: readonly [any, FailedValidationResults]) => [
    { ...payment, data: { ...payment.data, public: { ...validPublicData } } },
    failedValidationResults?.[0] === PaymentValidator.errors.invalidData
      ? [PaymentValidator.errors.invalidPrivateData]
      : failedValidationResults

  ])
] as NegativeTestCases;
