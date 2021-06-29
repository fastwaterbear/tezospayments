import { Service } from '@tezos-payments/common/dist/models/service';

import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';

export interface ServiceProvider {
  getService(serviceAddress: string): Promise<ServiceResult<Service, LocalPaymentServiceError>>;
}
