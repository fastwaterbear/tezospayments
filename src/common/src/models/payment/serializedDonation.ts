import type { Donation } from './donation';

export type SerializedDonation = {
  /**
   * data
   */
  d?: Donation['data'];
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

export type NonSerializedDonationSlice = Pick<Donation, 'targetAddress'>;
