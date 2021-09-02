import type { CustomNetwork, Network, PaymentUrlType } from '@tezospayments/common';

import type { Payment } from './models';

export interface TezosPaymentsApiSigningOptions {
  apiSecretKey: string;
}

export interface TezosPaymentsWalletSigningOptions {
  walletSigning: (dataBytes: string) => Promise<string>;
}

export type TezosPaymentsCustomSigning = (payment: Omit<Payment, 'url'>) => Promise<string>;

type TezosPaymentsSigningOptions =
  | TezosPaymentsApiSigningOptions
  | TezosPaymentsWalletSigningOptions
  | TezosPaymentsCustomSigning;

export interface DefaultPaymentParameters {
  network: Network | CustomNetwork;
  urlType: PaymentUrlType;
}

export interface TezosPaymentsOptions {
  serviceContractAddress: string;
  signing: TezosPaymentsSigningOptions;
  defaultPaymentParameters?: Partial<DefaultPaymentParameters>;
}

interface PaymentCreateParametersBase {
  amount: string;
  asset?: string;
  data: Payment['data'];
  created?: number;
  expired?: number;
  successUrl?: string;
  cancelUrl?: string;
}

export type PaymentCreateParameters = PaymentCreateParametersBase & Partial<DefaultPaymentParameters>;
