import type { Network } from '@tezospayments/common';

export abstract class BlockchainUrlExplorer {
  constructor(readonly network: Network, readonly baseUrl: string) {
  }

  abstract getEntityUrl(entity: string): string;
  abstract getOperationUrl(operationHash: string): string;
  abstract getAccountUrl(contractAddress: string): string;
}
