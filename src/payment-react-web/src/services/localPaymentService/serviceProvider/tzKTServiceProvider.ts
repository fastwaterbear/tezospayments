import { Network, networks } from '@tezospayments/common/dist/models/blockchain';

import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';
import { IndexerServiceProvider, ServiceDto } from './indexerServiceProvider';

export class TzKTServiceProvider extends IndexerServiceProvider {
  private static readonly defaultBaseUrl = 'https://api.tzkt.io';
  private static readonly networkBaseUrlMap: ReadonlyMap<Network['id'], string> = new Map<Network['id'], string>()
    .set(networks.main.id, 'https://api.tzkt.io')
    .set(networks.florence.id, 'https://api.florencenet.tzkt.io')
    .set(networks.edo2net.id, 'https://api.edo2net.tzkt.io');

  constructor(network: Network) {
    super(TzKTServiceProvider.networkBaseUrlMap.get(network.id) || TzKTServiceProvider.defaultBaseUrl, network);
  }

  async getServiceInternal(serviceAddress: string): Promise<ServiceResult<ServiceDto, LocalPaymentServiceError>> {
    const response = await fetch(`${this.baseUrl}/v1/contracts/${serviceAddress}/storage`);

    return response.ok
      ? await response.json()
      : { isServiceError: true, error: await response.text() };
  }
}
