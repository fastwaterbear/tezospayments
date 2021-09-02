import type { Payment } from './payment';
export declare type SerializedPayment = {
    /**
     * amount
     */
    a: string;
    /**
     * data
     */
    d: Payment['data'];
    /**
     * created
     */
    c: number;
    /**
     * asset
     */
    as?: string;
    /**
     * successUrl
     */
    su?: string;
    /**
     * cancelUrl
     */
    cu?: string;
    /**
     * expired
     */
    e?: number;
};
export declare type LegacySerializedPayment = {
    amount: string;
    data: Payment['data'];
    created: number;
    asset?: string;
    successUrl?: string;
    cancelUrl?: string;
    expired?: number;
};
export declare type NonSerializedPaymentSlice = Pick<Payment, 'targetAddress'>;
