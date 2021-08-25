import { guards } from '@tezospayments/common';

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
    return validationErrors
      .reduce((result, error, index) => `${result}\n\t${index + 1}. ${error};`, 'options are invalid, see details below:');
  }
}
