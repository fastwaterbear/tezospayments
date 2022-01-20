export declare type Payment = import('@tezospayments/common').Payment & {
    readonly url: string;
};
export declare enum SigningType {
    ApiSecretKey = 0,
    Wallet = 1,
    Custom = 2
}
