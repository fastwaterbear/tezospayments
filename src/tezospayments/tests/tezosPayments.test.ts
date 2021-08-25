import { TezosPayments } from '../src';
import { InvalidTezosPaymentsOptionsError } from '../src/errors';
import { invalidTezosPaymentsOptionsTestCases, validTezosPaymentsOptionsTestCases } from './testCases';
import { getSigningType } from './testHelpers';

describe('TezosPayments', () => {
  test.each(validTezosPaymentsOptionsTestCases)(
    'create a new instance of the TezosPayments with valid options: %p',
    (_, tezosPaymentsOptions) => {
      const tezosPayments = new TezosPayments(tezosPaymentsOptions);

      /* eslint-disable @typescript-eslint/no-explicit-any */
      expect((tezosPayments as any).serviceContractAddress).toEqual(tezosPaymentsOptions.serviceContractAddress);
      expect((tezosPayments as any).signer.signingType).toEqual(getSigningType(tezosPaymentsOptions.signing));
      expect((tezosPayments as any).defaultPaymentParameters).toEqual({
        ...TezosPayments.defaultPaymentParameters,
        ...tezosPaymentsOptions.defaultPaymentParameters,
      });
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }
  );

  test.each(invalidTezosPaymentsOptionsTestCases)(
    'create a new instance of the TezosPayments with invalid options: %p',
    (_, tezosPaymentsOptions, expectedErrors) => {
      expect(() => new TezosPayments(tezosPaymentsOptions)).toThrow(new InvalidTezosPaymentsOptionsError(expectedErrors));
    }
  );
});
