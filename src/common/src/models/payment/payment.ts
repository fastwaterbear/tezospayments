import { PaymentParser, NonIncludedPaymentFields, PaymentValidator } from '../../helpers';
import { URL } from '../../native';
import { PaymentBase, PaymentType, PrivatePaymentData, PublicPaymentData } from './paymentBase';

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

  static publicDataExists(payment: Payment): payment is Payment & { readonly data: PublicPaymentData };
  static publicDataExists(paymentData: Payment['data']): paymentData is Payment['data'] & PublicPaymentData;
  static publicDataExists(
    paymentOrPaymentDataOrPaymentData: Payment | Payment['data']
  ): paymentOrPaymentDataOrPaymentData is (Payment & { readonly data: PublicPaymentData }) | (Payment['data'] & PublicPaymentData) {
    return super.publicDataExistsInternal(paymentOrPaymentDataOrPaymentData);
  }

  static privateDataExists(payment: Payment): payment is Payment & { readonly data: PrivatePaymentData } {
    return super.privateDataExists(payment);
  }

  static parse(paymentBase64: string, nonIncludedFields: NonIncludedPaymentFields, parser = Payment.defaultParser): Payment | null {
    return parser.parse(paymentBase64, nonIncludedFields);
  }
}
