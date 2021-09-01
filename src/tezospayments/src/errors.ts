import { guards } from '@tezospayments/common';

const getErrorMessageByValidationErrors = (validationErrors: readonly string[], brief = '') => validationErrors
  .reduce((result, error, index) => `${result}\n\t${index + 1}. ${error};`, brief);

export abstract class TezosPaymentsError extends Error {
  readonly name: string;

  constructor(message?: string) {
    super(message);

    this.name = this.constructor.name;
  }
}

export class InvalidTezosPaymentsOptionsError extends TezosPaymentsError {
  constructor(message?: string);
  constructor(validationErrors: readonly string[]);
  constructor(messageOrValidationErrors: (string | undefined) | readonly string[]) {
    super(
      guards.isReadonlyArray(messageOrValidationErrors)
        ? InvalidTezosPaymentsOptionsError.getMessage(messageOrValidationErrors)
        : messageOrValidationErrors
    );
  }

  private static getMessage(validationErrors: readonly string[]): string {
    return getErrorMessageByValidationErrors(validationErrors, 'options are invalid, see details below:');
  }
}

export class InvalidPaymentCreateParametersError extends TezosPaymentsError {
}

export class InvalidPaymentError extends TezosPaymentsError {
  constructor(message?: string);
  constructor(validationErrors: readonly string[]);
  constructor(messageOrValidationErrors: (string | undefined) | readonly string[]) {
    super(
      guards.isReadonlyArray(messageOrValidationErrors)
        ? InvalidPaymentError.getMessage(messageOrValidationErrors)
        : messageOrValidationErrors
    );
  }

  private static getMessage(validationErrors: readonly string[]): string {
    return getErrorMessageByValidationErrors(validationErrors, 'payment is invalid, see details below:');
  }
}

export class UnsupportedPaymentUrlTypeError extends TezosPaymentsError {
}

export class PaymentUrlError extends TezosPaymentsError {
}
