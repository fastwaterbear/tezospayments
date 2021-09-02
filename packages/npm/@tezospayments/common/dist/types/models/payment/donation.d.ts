import BigNumber from 'bignumber.js';
import { DonationValidator } from '../../helpers';
import { URL } from '../../native';
import { DonationDeserializer, LegacyDonationDeserializer } from '../../serialization';
import { StateModel } from '../core';
import { PaymentBase, PaymentType } from './paymentBase';
import { NonSerializedDonationSlice } from './serializedDonation';
export interface Donation extends PaymentBase {
    readonly type: PaymentType.Donation;
    readonly desiredAmount?: BigNumber;
    readonly desiredAsset?: string;
    readonly successUrl?: URL;
    readonly cancelUrl?: URL;
}
export declare class Donation extends StateModel {
    static readonly defaultDeserializer: DonationDeserializer;
    static readonly defaultLegacyDeserializer: LegacyDonationDeserializer;
    static readonly defaultValidator: DonationValidator;
    static validate(donation: Donation): import("..").FailedValidationResults;
    static deserialize(serializedDonation: string, nonSerializedDonationSlice: NonSerializedDonationSlice, isLegacy?: boolean): Donation | null;
}
