import type { Payment } from '../../models/payment';
import { PaymentFieldInfoType, PaymentParserBase } from './paymentParserBase';
declare type RawPaymentBase = {
    amount: string;
    data: Payment['data'];
    created: number;
    asset?: string;
    successUrl?: string;
    cancelUrl?: string;
    expired?: number;
};
export declare type RawPayment = Partial<RawPaymentBase>;
export declare type ValidRawPayment = RawPaymentBase;
export declare type NonIncludedPaymentFields = Pick<Payment, 'type' | 'targetAddress' | 'urls'>;
export declare class PaymentParser extends PaymentParserBase<Payment, RawPayment, ValidRawPayment, NonIncludedPaymentFields> {
    private _paymentFieldTypes;
    protected get paymentFieldTypes(): ReadonlyMap<keyof RawPaymentBase, PaymentFieldInfoType | readonly PaymentFieldInfoType[]>;
    protected mapRawPaymentToPayment(rawPayment: ValidRawPayment, nonIncludedFields: NonIncludedPaymentFields): Payment;
}
export {};
