import { TezosPayments } from '../src';
import { InvalidTezosPaymentsOptionsError } from '../src/errors';
import { invalidTezosPaymentsOptionsTestCases } from './testCases';

describe('TezosPayments', () => {
  test.each(invalidTezosPaymentsOptionsTestCases)(
    'create a new instance of the TezosPayments with invalid options: %p',
    (_, tezosPaymentsOptions, expectedErrors) => {
      expect(() => new TezosPayments(tezosPaymentsOptions)).toThrow(new InvalidTezosPaymentsOptionsError(expectedErrors));
    }
  );
});
