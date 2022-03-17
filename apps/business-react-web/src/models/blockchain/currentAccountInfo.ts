import { Network } from '@tezospayments/common';

export interface CurrentAccountInfo {
  readonly address: string;
  readonly network: Network;
}
