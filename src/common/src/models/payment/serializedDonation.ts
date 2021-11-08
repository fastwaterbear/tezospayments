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
  /**
   * signature
   */
  s?: SerializedDonationSignature;
};

export type SerializedDonationSignature = {
  /**
   * signingPublicKey
   */
  k: string;
  /**
   * client
   */
  cl: string;
};

export type LegacySerializedDonation = {
  desiredAmount?: string;
  desiredAsset?: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type NonSerializedDonationSlice = Pick<Donation, 'targetAddress'>;
