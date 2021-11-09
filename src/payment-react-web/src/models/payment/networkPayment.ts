import type { Donation, Payment } from '@tezospayments/common';

export type NetworkPayment = Pick<Payment,
  | 'type'
  | 'targetAddress'
  | 'id'
  | 'amount'
  | 'asset'
> & { signature: string };

export type NetworkDonation = Pick<Donation, 'type' | 'targetAddress'>
  & Pick<Payment, 'amount' | 'asset'>
  & { payload?: string };
