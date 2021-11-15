import type { Donation, Payment } from '@tezospayments/common';

export interface NetworkAsset {
  readonly address: string;
  readonly id: number | null;
}

export type NetworkPayment = Pick<Payment,
  | 'type'
  | 'targetAddress'
  | 'id'
  | 'amount'
> & { readonly asset?: NetworkAsset; readonly signature: string };

export type NetworkDonation = Pick<Donation, 'type' | 'targetAddress'>
  & Pick<Payment, 'amount'>
  & { readonly assetAddress?: string; readonly payload?: { [fieldName: string]: unknown; } };
