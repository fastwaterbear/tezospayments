import { PaymentBase } from '../../models/payment/paymentBase';
import type { FailedValidationResults } from '../../models/validation';
import { guards } from '../../utils';
import { PaymentValidationMethod } from './paymentValidationMethod';

export abstract class PaymentValidatorBase<TPayment extends PaymentBase> {
  protected readonly abstract validationMethods: ReadonlyArray<PaymentValidationMethod<TPayment>>;
  protected readonly abstract invalidPaymentObjectError: string;

  validate(payment: TPayment, bail = false): FailedValidationResults {
    if (!guards.isPlainObject(payment))
      return [this.invalidPaymentObjectError];

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
}
