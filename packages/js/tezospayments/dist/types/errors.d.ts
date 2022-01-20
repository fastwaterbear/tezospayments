export declare abstract class TezosPaymentsError extends Error {
    readonly name: string;
    constructor(message?: string);
}
export declare class InvalidTezosPaymentsOptionsError extends TezosPaymentsError {
    constructor(message?: string);
    constructor(validationErrors: readonly string[]);
    private static getMessage;
}
export declare class InvalidPaymentCreateParametersError extends TezosPaymentsError {
}
export declare class InvalidPaymentError extends TezosPaymentsError {
    constructor(message?: string);
    constructor(validationErrors: readonly string[]);
    private static getMessage;
}
export declare class UnsupportedPaymentUrlTypeError extends TezosPaymentsError {
}
export declare class PaymentUrlError extends TezosPaymentsError {
}
export declare class DonationUrlError extends TezosPaymentsError {
}
