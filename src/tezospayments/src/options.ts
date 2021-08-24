import type { Network } from '@tezospayments/common';

import type { Payment, PaymentUrlType, SigningType } from './models';

interface TezosPaymentsApiSigningOptions {
  apiSecretKey: string;
}

interface TezosPaymentsWalletSigningOptions {
  walletSigning: (dataBytes: string) => Promise<string>;
}

type TezosPaymentsSigningOptions =
  | TezosPaymentsApiSigningOptions
  | TezosPaymentsWalletSigningOptions
  | (TezosPaymentsApiSigningOptions & TezosPaymentsWalletSigningOptions)
  | ((payment: Payment, signingType: SigningType) => Promise<string>);

interface DefaultPaymentParameters {
  network: Network;
  signingType: SigningType;
  urlType: PaymentUrlType;
}

export interface TezosPaymentsOptions {
  signing: TezosPaymentsSigningOptions;
  serviceContractAddress: string;
  defaultPaymentParameters: Partial<DefaultPaymentParameters>;
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
