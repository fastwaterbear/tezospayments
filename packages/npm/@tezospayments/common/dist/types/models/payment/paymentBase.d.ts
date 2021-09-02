export declare enum PaymentType {
    Payment = 1,
    Donation = 2
}
export interface PaymentBase {
    readonly type: PaymentType;
    readonly targetAddress: string;
}
