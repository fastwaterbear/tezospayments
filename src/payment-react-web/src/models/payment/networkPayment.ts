import type { Donation, Payment } from '@tezospayments/common/dist/models/payment';

export type NetworkPayment = Pick<Payment, 'type' | 'targetAddress' | 'amount' | 'asset' | 'data'>;
export type NetworkDonation = Pick<Donation, 'type' | 'targetAddress'> & Pick<Payment, 'amount' | 'asset'>;
