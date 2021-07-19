import { PaymentParser, NonIncludedPaymentFields, PaymentValidator } from '../../helpers';
import { PaymentBase, PaymentType } from './paymentBase';

interface PublicPaymentData {
  readonly public: { readonly [fieldName: string]: unknown; };
}

interface PrivatePaymentData {
  readonly private: { readonly [fieldName: string]: unknown; };
}

type PaymentData =
  | PublicPaymentData
  | PrivatePaymentData
  | PublicPaymentData & PrivatePaymentData;

export interface Payment extends PaymentBase {
  readonly type: PaymentType.Payment;
  readonly data: PaymentData;
  readonly expired?: Date;
}

export class Payment extends PaymentBase {
  static readonly defaultParser: PaymentParser = new PaymentParser();
  static readonly defaultValidator: PaymentValidator = new PaymentValidator();

  static validate(payment: Payment) {
    return this.defaultValidator.validate(payment);
  }

  static parse(payment64: string, nonIncludedFields: NonIncludedPaymentFields, parser = Payment.defaultParser): Payment | null {
    return parser.parse(payment64, nonIncludedFields);
  }

  static publicDataExists(payment: Payment): payment is Payment & { readonly data: PublicPaymentData };
  static publicDataExists(paymentData: Payment['data']): paymentData is Payment['data'] & PublicPaymentData;
  static publicDataExists(
    paymentOrPaymentDataOrPaymentData: Payment | Payment['data']
  ): paymentOrPaymentDataOrPaymentData is (Payment & { readonly data: PublicPaymentData }) | (Payment['data'] & PublicPaymentData) {
    return this.publicDataExistsInternal(paymentOrPaymentDataOrPaymentData);
  }

  static privateDataExists(payment: Payment): payment is Payment & { readonly data: PrivatePaymentData } {
    return !!(payment.data as PrivatePaymentData).private;
  }

  protected static publicDataExistsInternal(
    paymentOrPaymentDataOrPaymentData: Payment | Payment['data']
  ): paymentOrPaymentDataOrPaymentData is (Payment & { readonly data: PublicPaymentData }) | (Payment['data'] & PublicPaymentData) {
    return !!(Payment.isPayment(paymentOrPaymentDataOrPaymentData)
      ? (paymentOrPaymentDataOrPaymentData.data as PublicPaymentData).public
      : (paymentOrPaymentDataOrPaymentData as PublicPaymentData).public
    );
  }

  private static isPayment(paymentOrPaymentDataOrPaymentData: Payment | Payment['data']): paymentOrPaymentDataOrPaymentData is Payment {
    return !!(paymentOrPaymentDataOrPaymentData as Payment).amount;
  }
}
