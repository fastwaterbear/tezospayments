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
  das?: SerializedDonationAsset;
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

export interface SerializedDonationAsset {
  /**
   * address
   */
  a: string;
  /**
   * id
   */
  i?: number;
}

export interface SerializedDonationSignature {
  /**
   * client
   */
  cl: string;
  /**
   * signingPublicKey
   */
  k: string;
}

export type NonSerializedDonationSlice = Pick<Donation, 'targetAddress'>;
