import { tezosInfo } from '@tezospayments/common';

import { BlockchainUrlExplorer } from './blockchainUrlExplorer';

export class BetterCallDevBlockchainUrlExplorer extends BlockchainUrlExplorer {
  getEntityUrl(entity: string) {
    return tezosInfo.addressPrefixes.some(prefix => entity.startsWith(prefix))
      ? this.getAccountUrl(entity)
      : this.getOperationUrl(entity);
  }

  getOperationUrl(operationHash: string) {
    return `${this.baseUrl}/${this.network.name}/opg/${operationHash}/contents`;
  }

  getAccountUrl(contractAddress: string) {
    return `${this.baseUrl}/${this.network.name}/${contractAddress}`;
  }
}
