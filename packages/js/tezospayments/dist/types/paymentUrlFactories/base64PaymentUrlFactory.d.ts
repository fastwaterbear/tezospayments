import { native, PaymentSerializer, CustomNetwork, Network, Payment, Donation, DonationSerializer } from '@tezospayments/common';
import { PaymentUrlFactory } from './paymentUrlFactory';
export declare class Base64PaymentUrlFactory extends PaymentUrlFactory {
    readonly baseUrl: string;
    static readonly baseUrl: "https://payment.tezospayments.com";
    protected readonly paymentSerializer: PaymentSerializer;
    protected readonly donationSerializer: DonationSerializer;
    constructor(baseUrl?: string);
    createPaymentUrl(paymentOrDonation: Payment | Donation, network: Network | CustomNetwork): string;
    protected createPaymentUrlInternal(payment: Payment, network: Network | CustomNetwork): string;
    protected createDonationUrlInternal(donation: Donation, network: Network | CustomNetwork): string;
    protected createUrl(baseUrl: native.URL, serializedPaymentOrDonationBase64: string, network: Network | CustomNetwork): string;
}
