import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';
import { IndexerServiceProvider, ServiceDto } from './indexerServiceProvider';

export class TzKTServiceProvider extends IndexerServiceProvider {
  async getServiceInternal(serviceAddress: string): Promise<ServiceResult<ServiceDto, LocalPaymentServiceError>> {
    const response = await fetch(`${this.baseUrl}/v1/contracts/${serviceAddress}/storage`);

    return response.ok
      ? await response.json()
      : { isServiceError: true, error: await response.text() };
  }
}
