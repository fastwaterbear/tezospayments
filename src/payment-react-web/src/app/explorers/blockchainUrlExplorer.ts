import type { Network } from '@tezospayments/common/dist/models/blockchain';

export abstract class BlockchainUrlExplorer {
  constructor(readonly network: Network, readonly baseUrl: string) {
  }

  abstract getOperationUrl(operationHash: string): string;
  abstract getContractUrl(contractAddress: string): string;
}
