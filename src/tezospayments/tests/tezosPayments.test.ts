import { TezosPayments } from '../src';
import { InvalidTezosPaymentsOptionsError } from '../src/errors';
import { invalidTezosPaymentsOptionsTestCases, validTezosPaymentsOptionsTestCases } from './testCases';

describe('TezosPayments', () => {
  test.each(validTezosPaymentsOptionsTestCases)(
    'create a new instance of the TezosPayments with valid options: %p',
    (_, tezosPaymentsOptions) => {
      const tezosPayments = new TezosPayments(tezosPaymentsOptions);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((tezosPayments as any).options).toEqual(tezosPaymentsOptions);
    }
  );

  test.each(invalidTezosPaymentsOptionsTestCases)(
    'create a new instance of the TezosPayments with invalid options: %p',
    (_, tezosPaymentsOptions, expectedErrors) => {
      expect(() => new TezosPayments(tezosPaymentsOptions)).toThrow(new InvalidTezosPaymentsOptionsError(expectedErrors));
    }
  );
});
