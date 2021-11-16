import BigNumber from 'bignumber.js';
import { DonationValidator } from '../../helpers';
import { URL } from '../../native';
import { DonationDeserializer } from '../../serialization';
import { StateModel } from '../core';
import type { DonationSignature } from '../signing';
import { PaymentBase, PaymentType } from './paymentBase';
import { NonSerializedDonationSlice } from './serializedDonation';
export interface Donation extends PaymentBase {
    readonly type: PaymentType.Donation;
    readonly data?: DonationData;
    readonly desiredAmount?: BigNumber;
    readonly desiredAsset?: DonationAsset;
    readonly successUrl?: URL;
    readonly cancelUrl?: URL;
    readonly signature?: DonationSignature;
}
export declare type UnsignedDonation = Omit<Donation, 'signature'>;
interface DonationData {
    readonly [fieldName: string]: unknown;
}
export interface DonationAsset {
    readonly address: string;
    readonly id: number | null;
}
export declare class Donation extends StateModel {
    static readonly defaultDeserializer: DonationDeserializer;
    static readonly defaultValidator: DonationValidator;
    static validate(donation: Donation): import("..").FailedValidationResults;
    static deserialize(serializedDonation: string, nonSerializedDonationSlice: NonSerializedDonationSlice): Donation | null;
}
export {};
