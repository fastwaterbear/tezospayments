import { BlockchainUrlExplorer } from './blockchainUrlExplorer';

export class BetterCallDevBlockchainUrlExplorer extends BlockchainUrlExplorer {
  getOperationUrl(operationHash: string) {
    return `${this.baseUrl}/${this.network.name}/opg/${operationHash}/contents`;
  }

  getContractUrl(contractAddress: string) {
    return `${this.baseUrl}/${this.network.name}/${contractAddress}`;
  }
}
