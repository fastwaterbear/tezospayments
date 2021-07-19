import { Network, networks } from '@tezospayments/common/dist/models/blockchain';

import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';
import { IndexerServiceProvider, ServiceDto } from './indexerServiceProvider';

export class TzStatsServiceProvider extends IndexerServiceProvider {
  private static readonly defaultBaseUrl = 'https://api.tzstats.com';
  private static readonly networkBaseUrlMap: ReadonlyMap<Network['id'], string> = new Map<Network['id'], string>()
    .set(networks.main.id, 'https://api.tzstats.com')
    .set(networks.florence.id, 'https://api.florence.tzstats.com')
    .set(networks.edo2net.id, 'https://api.edo.tzstats.com');

  constructor(network: Network) {
    super(TzStatsServiceProvider.networkBaseUrlMap.get(network.id) || TzStatsServiceProvider.defaultBaseUrl, network);
  }

  async getServiceInternal(serviceAddress: string): Promise<ServiceResult<ServiceDto, LocalPaymentServiceError>> {
    const response = await fetch(`${this.baseUrl}/explorer/contract/${serviceAddress}/storage`);

    return response.ok
      ? (await response.json() as ServiceContractStorage).value
      : { isServiceError: true, error: await response.text() };
  }
}

interface ServiceContractStorage {
  readonly value: ServiceDto;
}
