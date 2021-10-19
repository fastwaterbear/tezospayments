import { BlockchainUrlExplorer } from './blockchainUrlExplorer';

export class TzKTBlockchainUrlExplorer extends BlockchainUrlExplorer {
  getOperationUrl(operationHash: string) {
    return `${this.baseUrl}/${operationHash}`;
  }

  getContractUrl(contractAddress: string) {
    return `${this.baseUrl}/${contractAddress}`;
  }
}
