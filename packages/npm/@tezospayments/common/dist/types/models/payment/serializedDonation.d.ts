import type { Donation } from './donation';
export declare type SerializedDonation = {
    /**
     * desiredAmount
     */
    da?: string;
    /**
     * desiredAsset
     */
    das?: string;
    /**
     * successUrl
     */
    su?: string;
    /**
     * cancelUrl
     */
    cu?: string;
};
export declare type LegacySerializedDonation = {
    desiredAmount?: string;
    desiredAsset?: string;
    successUrl?: string;
    cancelUrl?: string;
};
export declare type NonSerializedDonationSlice = Pick<Donation, 'targetAddress'>;
