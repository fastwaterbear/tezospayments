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
    targetAddressHasInvalidLength: 'Target address has invalid address',
    invalidData: 'Payment data is invalid',
    invalidPublicData: 'Payment public data is invalid',
    invalidPrivateData: 'Payment private data is invalid',
    publicDataShouldBeFlat: 'Public data should be flat',
    privateDataShouldBeFlat: 'Private data should be flat',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly validationMethods: ReadonlyArray<(payment: Payment) => FailedValidationResults> = [
    payment => this.validateTargetAddress(payment.targetAddress),
    payment => this.validateAmount(payment.amount),
    payment => this.validateData(payment.data),
  ];

  validate(payment: Payment, bail = false): FailedValidationResults {
    if (!guards.isPlainObject(payment))
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

  protected validateTargetAddress(targetAddress: string): FailedValidationResults {
    if (typeof targetAddress !== 'string')
      return [PaymentValidator.errors.invalidTargetAddress];

    if (targetAddress.length !== tezosAddressLength)
      return [PaymentValidator.errors.targetAddressHasInvalidLength];

    if (!tezosAddressPrefixes.some(prefix => targetAddress.startsWith(prefix)))
      return [PaymentValidator.errors.targetAddressIsNotNetworkAddress];
  }

  protected validateAmount(amount: BigNumber): FailedValidationResults {
    if (!BigNumber.isBigNumber(amount) || amount.isNaN() || !amount.isFinite())
      return [PaymentValidator.errors.invalidAmount];

    if (amount.isNegative())
      return [PaymentValidator.errors.amountIsNegative];
  }

  protected validateData(data: Payment['data']): FailedValidationResults {
    if (!guards.isPlainObject(data) || Object.keys(data).some(key => key !== 'public' && key !== 'private'))
      return [PaymentValidator.errors.invalidData];

    const publicData = (data as Exclude<Payment['data'], { private: unknown }>).public;
    const privateData = (data as Exclude<Payment['data'], { public: unknown }>).private;
    if (!(publicData || privateData))
      return [PaymentValidator.errors.invalidData];

    if (publicData !== undefined) {
      if (!guards.isPlainObject(publicData))
        return [PaymentValidator.errors.invalidPublicData];
      if (!this.isFlatObject(publicData))
        return [PaymentValidator.errors.publicDataShouldBeFlat];
    }

    if (privateData !== undefined) {
      if (!guards.isPlainObject(privateData))
        return [PaymentValidator.errors.invalidPrivateData];
      if (!this.isFlatObject(privateData))
        return [PaymentValidator.errors.privateDataShouldBeFlat];
    }
  }

  private isFlatObject(obj: Record<string, unknown>) {
    for (const propertyName of Object.getOwnPropertyNames(obj)) {
      const property = obj[propertyName];
      if (typeof property === 'object' || typeof property === 'function')
        return false;
    }

    return true;
  }
}
