import { BigNumber } from 'bignumber.js';
import { DonationParser, NonIncludedDonationFields, DonationValidator } from '../../helpers';
import { URL } from '../../native';
import { StateModel } from '../core';
import { PaymentBase, PaymentType } from './paymentBase';
export interface Donation extends PaymentBase {
    readonly type: PaymentType.Donation;
    readonly desiredAmount?: BigNumber;
    readonly desiredAsset?: string;
    readonly successUrl?: URL;
    readonly cancelUrl?: URL;
}
export declare class Donation extends StateModel {
    static readonly defaultParser: DonationParser;
    static readonly defaultValidator: DonationValidator;
    static validate(donation: Donation): import("..").FailedValidationResults;
    static parse(donationBase64: string, nonIncludedFields: NonIncludedDonationFields, parser?: DonationParser): Donation | null;
}
