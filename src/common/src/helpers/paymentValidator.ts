import { BigNumber } from 'bignumber.js';

import type { Payment } from '../models/payment';
import type { FailedValidationResults } from '../models/validation';
import { guards } from '../utils';

export class PaymentValidator {
  static readonly errors = {
    invalidPaymentObject: 'Payment is undefined or not object',
    invalidAmount: 'Amount is invalid',
    amountIsNegative: 'Amount is less than zero'
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly validationMethods: ReadonlyArray<(payment: Payment) => FailedValidationResults> = [
    (payment: Payment) => this.validateAmount(payment.amount)
  ];

  validate(payment: Payment, bail = false): FailedValidationResults {
    if (!payment || typeof payment !== 'object' || guards.isArray(payment))
      return [PaymentValidator.errors.invalidPaymentObject];

    const failedValidationResults: FailedValidationResults = bail ? [] : undefined;
    for (const validationMethod of this.validationMethods) {
      const currentFailedValidationResults = validationMethod(payment);
      if (currentFailedValidationResults) {
        if (!bail)
          return currentFailedValidationResults;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        failedValidationResults!.concat(currentFailedValidationResults);
      }
    }

    return failedValidationResults;
  }

  private validateAmount(amount: BigNumber): FailedValidationResults {
    if (!BigNumber.isBigNumber(amount) || amount.isNaN() || !amount.isFinite())
      return [PaymentValidator.errors.invalidAmount];

    if (amount.isNegative())
      return [PaymentValidator.errors.amountIsNegative];
  }
}
