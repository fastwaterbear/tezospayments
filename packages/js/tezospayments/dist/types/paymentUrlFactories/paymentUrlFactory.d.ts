import { CustomNetwork, Donation, Network, Payment, PaymentUrlType } from '@tezospayments/common';
export declare abstract class PaymentUrlFactory {
    readonly urlType: PaymentUrlType;
    constructor(urlType: PaymentUrlType);
    abstract createPaymentUrl(paymentOrDonation: Payment | Donation, network: Network | CustomNetwork): string | Promise<string>;
}
