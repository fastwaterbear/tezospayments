import { BigNumber } from 'bignumber.js';

import type { Payment } from '../models/payment';
import type { FailedValidationResults } from '../models/validation';
import { guards } from '../utils';

const tezosAddressLength = 36;
const tezosAddressPrefixes: readonly string[] = ['KT', 'tz1', 'tz2', 'tz3'];

export class PaymentValidator {
  static readonly errors = {
    invalidPaymentObject: 'Payment is undefined or not object',
    invalidAmount: 'Amount is invalid',
    amountIsNegative: 'Amount is less than zero',
    invalidTargetAddress: 'Target address is invalid',
    targetAddressIsNotNetworkAddress: 'Target address isn\'t a network address',
    targetAddressHasInvalidLength: 'Target address has invalid address'
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly validationMethods: ReadonlyArray<(payment: Payment) => FailedValidationResults> = [
    payment => this.validateTargetAddress(payment.targetAddress),
    payment => this.validateAmount(payment.amount),
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

  private validateTargetAddress(targetAddress: string): FailedValidationResults {
    if (typeof targetAddress !== 'string')
      return [PaymentValidator.errors.invalidTargetAddress];

    if (targetAddress.length !== tezosAddressLength)
      return [PaymentValidator.errors.targetAddressHasInvalidLength];

    if (!tezosAddressPrefixes.some(prefix => targetAddress.startsWith(prefix)))
      return [PaymentValidator.errors.targetAddressIsNotNetworkAddress];
  }

  private validateAmount(amount: BigNumber): FailedValidationResults {
    if (!BigNumber.isBigNumber(amount) || amount.isNaN() || !amount.isFinite())
      return [PaymentValidator.errors.invalidAmount];

    if (amount.isNegative())
      return [PaymentValidator.errors.amountIsNegative];
  }
}
