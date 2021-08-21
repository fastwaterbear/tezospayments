import { BigNumber } from 'bignumber.js';
import { PaymentParser, NonIncludedPaymentFields, PaymentValidator } from '../../helpers';
import { URL } from '../../native';
import { StateModel } from '../core';
import { PaymentBase, PaymentType } from './paymentBase';
interface PublicPaymentData {
    readonly public: {
        readonly [fieldName: string]: unknown;
    };
}
interface PrivatePaymentData {
    readonly private: {
        readonly [fieldName: string]: unknown;
    };
}
declare type PaymentData = PublicPaymentData | PrivatePaymentData | PublicPaymentData & PrivatePaymentData;
export interface Payment extends PaymentBase {
    readonly type: PaymentType.Payment;
    readonly amount: BigNumber;
    readonly asset?: string;
    readonly data: PaymentData;
    readonly created: Date;
    readonly expired?: Date;
    readonly successUrl?: URL;
    readonly cancelUrl?: URL;
}
export declare class Payment extends StateModel {
    static readonly defaultParser: PaymentParser;
    static readonly defaultValidator: PaymentValidator;
    static validate(payment: Payment): import("..").FailedValidationResults;
    static parse(payment64: string, nonIncludedFields: NonIncludedPaymentFields, parser?: PaymentParser): Payment | null;
    static publicDataExists(payment: Payment): payment is Payment & {
        readonly data: PublicPaymentData;
    };
    static publicDataExists(paymentData: Payment['data']): paymentData is Payment['data'] & PublicPaymentData;
    static privateDataExists(payment: Payment): payment is Payment & {
        readonly data: PrivatePaymentData;
    };
    protected static publicDataExistsInternal(paymentOrPaymentDataOrPaymentData: Payment | Payment['data']): paymentOrPaymentDataOrPaymentData is (Payment & {
        readonly data: PublicPaymentData;
    }) | (Payment['data'] & PublicPaymentData);
    private static isPayment;
}
export {};
