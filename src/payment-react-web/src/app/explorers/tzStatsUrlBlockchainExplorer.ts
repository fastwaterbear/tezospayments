import { BlockchainUrlExplorer } from './blockchainUrlExplorer';

export class TzStatsBlockchainUrlExplorer extends BlockchainUrlExplorer {
  getOperationUrl(operationHash: string) {
    return `${this.baseUrl}/${operationHash}`;
  }

  getContractUrl(contractAddress: string) {
    return `${this.baseUrl}/${contractAddress}`;
  }
}
