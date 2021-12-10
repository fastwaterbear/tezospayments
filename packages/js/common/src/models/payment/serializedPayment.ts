import type { Payment } from './payment';

export type SerializedPayment = {
  /**
   * id
   */
  i: string;
  /**
   * amount
   */
  a: string;
  /**
   * created
   */
  c: number;
  /**
   * data
   */
  d?: Payment['data'];
  /**
   * asset
   */
  as?: SerializedPaymentAsset;
  /**
   * successUrl
   */
  su?: string;
  /**
   * cancelUrl
   */
  cu?: string;
  /**
   * expired
   */
  e?: number;
  /**
   * signature
   */
  s: SerializedPaymentSignature;
};

export interface SerializedPaymentAsset {
  /**
   * address
   */
  a: string;
  /**
   * decimals
   */
  d: number;
  /**
   * id
   */
  i?: number;
}

export interface SerializedPaymentSignature {
  /**
   * contract
   */
  c: string;
  /**
   * client
   */
  cl?: string;
  /**
   * signingPublicKey
   */
  k: string;
}

export type NonSerializedPaymentSlice = Pick<Payment, 'targetAddress'>;
