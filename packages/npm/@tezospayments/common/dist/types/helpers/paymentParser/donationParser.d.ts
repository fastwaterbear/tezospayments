import type { Donation } from '../../models/payment/donation';
import { PaymentFieldInfoType, PaymentParserBase } from './paymentParserBase';
declare type RawDonationBase = {
    desiredAmount?: string;
    desiredAsset?: string;
    successUrl?: string;
    cancelUrl?: string;
};
export declare type RawDonation = Partial<RawDonationBase>;
export declare type ValidRawDonation = RawDonationBase;
export declare type NonIncludedDonationFields = Pick<Donation, 'type' | 'targetAddress' | 'urls'>;
export declare class DonationParser extends PaymentParserBase<Donation, RawDonation, ValidRawDonation, NonIncludedDonationFields> {
    private _paymentFieldTypes;
    protected get paymentFieldTypes(): ReadonlyMap<keyof RawDonationBase, PaymentFieldInfoType | readonly PaymentFieldInfoType[]>;
    protected mapRawPaymentToPayment(rawDonation: ValidRawDonation, nonIncludedFields: NonIncludedDonationFields): Donation;
}
export {};
