import type BigNumber from 'bignumber.js';

import type { Donation, Payment } from '@tezospayments/common';

export interface NetworkAsset {
  readonly address: string;
  readonly id: number | null;
}

export interface NetworkPayment {
  readonly type: Payment['type'];
  readonly targetAddress: string;
  readonly id: string;
  readonly amount: BigNumber;
  readonly asset?: NetworkAsset;
  readonly signature: string
}

export interface NetworkDonation {
  readonly type: Donation['type'];
  readonly targetAddress: string;
  readonly amount: BigNumber;
  readonly assetAddress?: string;
  readonly payload?: { [fieldName: string]: unknown; }
}
