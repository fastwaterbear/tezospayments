import { Network } from '@tezospayments/common/dist/models/blockchain';

export interface CurrentAccountInfo {
  readonly address: string;
  readonly network: Network;
}
