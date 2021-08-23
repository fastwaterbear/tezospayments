import type { Donation } from './donation';

export type SerializedDonation = {
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

export type LegacySerializedDonation = {
  desiredAmount?: string;
  desiredAsset?: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type NonSerializedDonationSlice = Pick<Donation, 'targetAddress'>;
