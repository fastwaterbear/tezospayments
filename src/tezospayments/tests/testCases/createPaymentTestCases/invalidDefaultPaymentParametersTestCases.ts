import { guards } from '@tezospayments/common';

import type { PaymentCreateParameters } from '../../../src';
import { InvalidPaymentError } from '../../../src/errors';
import { invalidDefaultPaymentParametersTestCases as invalidDefaultPaymentParametersInOptionsTestCases } from '../tezosPaymentsOptionsTestCases';
import type { NegativeTestCases } from './testCase';
import validPaymentTestCases from './validPaymentTestCases';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InvalidPaymentCreateParametersSlice = { network?: any, urlType?: any };

const validPaymentTestCase = validPaymentTestCases[0]!;
const tezosPaymentsOptions = validPaymentTestCase[1];
const paymentCreateParametersBase: PaymentCreateParameters & InvalidPaymentCreateParametersSlice = {
  ...validPaymentTestCase[2]
};
delete paymentCreateParametersBase.network;
delete paymentCreateParametersBase.urlType;

const invalidTezosPaymentsOptionsTestCases: NegativeTestCases<InvalidPaymentCreateParametersSlice> = invalidDefaultPaymentParametersInOptionsTestCases
  .filter(testCase => guards.isPlainObject(testCase[1].defaultPaymentParameters))
  .filter(testCase => 'urlType' in testCase[1].defaultPaymentParameters ? testCase[1].defaultPaymentParameters.urlType : true)
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
