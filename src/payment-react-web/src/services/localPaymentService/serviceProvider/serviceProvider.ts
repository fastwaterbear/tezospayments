import { Service } from '@tezospayments/common';

import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';

export interface ServiceProvider {
  getService(serviceAddress: string): Promise<ServiceResult<Service, LocalPaymentServiceError>>;
}
