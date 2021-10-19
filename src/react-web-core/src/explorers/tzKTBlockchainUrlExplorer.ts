import { BlockchainUrlExplorer } from './blockchainUrlExplorer';

export class TzKTBlockchainUrlExplorer extends BlockchainUrlExplorer {
  getEntityUrl(entity: string) {
    return `${this.baseUrl}/${entity}`;
  }

  getOperationUrl(operationHash: string) {
    return this.getEntityUrl(operationHash);
  }

  getAccountUrl(contractAddress: string) {
    return this.getEntityUrl(contractAddress);
  }
}
