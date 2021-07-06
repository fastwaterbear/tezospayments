import { PaymentParser, NonIncludedPaymentFields, PaymentValidator } from '../../helpers';
import { URL } from '../../native';
import { PaymentBase, PaymentType } from './paymentBase';

export interface Payment extends PaymentBase {
  readonly type: PaymentType.Payment;
  readonly successUrl: URL;
  readonly cancelUrl: URL;
  readonly expired?: Date;
}

export class Payment extends PaymentBase {
  static readonly defaultParser: PaymentParser = new PaymentParser();
  static readonly defaultValidator: PaymentValidator = new PaymentValidator();

  static validate(payment: Payment) {
    return this.defaultValidator.validate(payment);
  }

  static parse(paymentBase64: string, nonIncludedFields: NonIncludedPaymentFields, parser = Payment.defaultParser): Payment | null {
    return parser.parse(paymentBase64, nonIncludedFields);
  }
}
