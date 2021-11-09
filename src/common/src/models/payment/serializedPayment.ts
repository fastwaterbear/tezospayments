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
  as?: string;
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

export type SerializedPaymentSignature = {
  /**
   * signingPublicKey
   */
  k: string;
  /**
   * contract
   */
  c: string;
  /**
   * client
   */
  cl?: string;
};

export type NonSerializedPaymentSlice = Pick<Payment, 'targetAddress'>;
