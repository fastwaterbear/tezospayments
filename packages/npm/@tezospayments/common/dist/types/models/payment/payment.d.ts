import BigNumber from 'bignumber.js';
import { PaymentValidator } from '../../helpers';
import { URL } from '../../native';
import { LegacyPaymentDeserializer, PaymentDeserializer } from '../../serialization';
import { StateModel } from '../core';
import { PaymentBase, PaymentType } from './paymentBase';
import { NonSerializedPaymentSlice } from './serializedPayment';
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
    static readonly defaultDeserializer: PaymentDeserializer;
    static readonly defaultLegacyDeserializer: LegacyPaymentDeserializer;
    static readonly defaultValidator: PaymentValidator;
    static validate(payment: Payment): import("..").FailedValidationResults;
    static deserialize(serializedPayment: string, nonSerializedPaymentSlice: NonSerializedPaymentSlice, isLegacy?: boolean): Payment | null;
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
