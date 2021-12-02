import type { PaymentBase } from '../../models/payment/paymentBase';
import type { FailedValidationResults } from '../../models/validation';

export type PaymentValidationMethod<TPayment extends PaymentBase> = (payment: TPayment) => FailedValidationResults;
