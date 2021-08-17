import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';
import { IndexerServiceProvider, ServiceDto } from './indexerServiceProvider';

export class TzStatsServiceProvider extends IndexerServiceProvider {
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
