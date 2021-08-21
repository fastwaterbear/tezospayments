import { PaymentBase } from '../../models/payment/paymentBase';
import type { FailedValidationResults } from '../../models/validation';
import { PaymentValidationMethod } from './paymentValidationMethod';
export declare abstract class PaymentValidatorBase<TPayment extends PaymentBase> {
    protected readonly abstract validationMethods: ReadonlyArray<PaymentValidationMethod<TPayment>>;
    protected readonly abstract invalidPaymentObjectError: string;
    validate(payment: TPayment, bail?: boolean): FailedValidationResults;
}
