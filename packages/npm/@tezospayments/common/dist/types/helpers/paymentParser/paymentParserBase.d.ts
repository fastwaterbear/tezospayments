import { PaymentBase } from '../../models/payment/paymentBase';
export declare type PaymentFieldInfoType = 'object' | 'string' | 'number' | 'undefined' | 'null';
export declare abstract class PaymentParserBase<TPayment extends PaymentBase, TRawPayment extends Record<string, unknown>, TValidRawPayment extends TRawPayment, TNonIncludedFields extends Record<string, unknown>> {
    private _minPaymentFieldsCount;
    protected abstract get paymentFieldTypes(): ReadonlyMap<keyof TRawPayment, PaymentFieldInfoType | readonly PaymentFieldInfoType[]>;
    private get minPaymentFieldsCount();
    private get maxPaymentFieldsCount();
    parse(paymentBase64: string, nonIncludedFields: TNonIncludedFields): TPayment | null;
    protected abstract mapRawPaymentToPayment(rawPayment: TValidRawPayment, nonIncludedFields: TNonIncludedFields): TPayment;
    private validateAndMapRawPaymentToPayment;
    private validateRawPayment;
}
