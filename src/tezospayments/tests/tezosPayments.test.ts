import { TezosPayments } from '../src';
import { InvalidTezosPaymentsOptionsError } from '../src/errors';
import { invalidTezosPaymentsOptionsTestCases, validTezosPaymentsOptionsTestCases } from './testCases';
import { validPaymentTestCases } from './testCases/createPaymentTestCases';
import { getSigningType } from './testHelpers';

describe('TezosPayments', () => {
  test.each(validTezosPaymentsOptionsTestCases)(
    'creating a new instance of the TezosPayments with valid options: %p',
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
    'creating a new instance of the TezosPayments with invalid options: %p',
    (_, tezosPaymentsOptions, expectedErrors) => {
      expect(() => new TezosPayments(tezosPaymentsOptions)).toThrow(new InvalidTezosPaymentsOptionsError(expectedErrors));
    }
  );

  test.each(validPaymentTestCases)(
    'creating a new payment with valid payment parameters: %p',
    async (_, tezosPaymentsOptions, paymentCreateParameters, expectedPayment) => {
      !paymentCreateParameters.created && jest.useFakeTimers().setSystemTime(expectedPayment.created);

      const tezosPayments = new TezosPayments(tezosPaymentsOptions);
      const payment = await tezosPayments.createPayment(paymentCreateParameters);

      expect(payment).toEqual(expectedPayment);

      !paymentCreateParameters.created && jest.useRealTimers();
    }
  );
});
