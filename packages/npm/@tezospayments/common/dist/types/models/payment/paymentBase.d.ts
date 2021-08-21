import { URL } from '../../native';
export declare enum PaymentType {
    Payment = 1,
    Donation = 2
}
export declare type PaymentUrl = {
    type: 'base64';
    url: URL;
};
export interface PaymentBase {
    readonly type: PaymentType;
    readonly targetAddress: string;
    readonly urls: readonly PaymentUrl[];
}
