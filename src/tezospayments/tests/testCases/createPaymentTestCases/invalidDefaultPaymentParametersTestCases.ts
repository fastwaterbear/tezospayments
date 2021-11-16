import { guards } from '@tezospayments/common';

import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import { invalidDefaultPaymentParametersTestCases as invalidDefaultPaymentParametersInOptionsTestCases } from '../tezosPaymentsOptionsTestCases';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { urlType?: any };
const invalidPaymentCreateParametersSliceFieldInfos: Record<keyof InvalidPaymentCreateParametersSlice, boolean> = {
  // fieldName: isRequired
  urlType: false
};

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.urlType;

const invalidTezosPaymentsOptionsTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = invalidDefaultPaymentParametersInOptionsTestCases
  .filter(testCase => guards.isPlainObject(testCase[1].defaultPaymentParameters))
  .filter(testCase => {
    return Object.keys(testCase[1].defaultPaymentParameters)
      .some(fieldName => Object.keys(invalidPaymentCreateParametersSliceFieldInfos)
        .some(infoFieldName => {
          const typedInfoFieldName = infoFieldName as keyof InvalidPaymentCreateParametersSlice;

          return typedInfoFieldName === fieldName && (!invalidPaymentCreateParametersSliceFieldInfos[typedInfoFieldName]
            && testCase[1].defaultPaymentParameters[typedInfoFieldName] === undefined ? false : true);
        })
      );
  })
  .map(testCase => [
    testCase[0],
    tezosPaymentsOptions,
    {
      ...paymentCreateParametersBase,
      ...testCase[1].defaultPaymentParameters
    },
    InvalidPaymentError
  ]);

export default invalidTezosPaymentsOptionsTestCases;
