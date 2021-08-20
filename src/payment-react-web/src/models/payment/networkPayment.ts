import type { Donation, Payment } from '@tezospayments/common';

export type NetworkPayment = Pick<Payment, 'type' | 'targetAddress' | 'amount' | 'asset' | 'data'>;
export type NetworkDonation = Pick<Donation, 'type' | 'targetAddress'> & Pick<Payment, 'amount' | 'asset'>;
