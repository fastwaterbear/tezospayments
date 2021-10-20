import type { Service, ServiceOperation } from '@tezospayments/common';

export interface ServicesProvider {
  getService(serviceContractAddress: string): Promise<Service>;
  getServices(ownerAddress: string): Promise<readonly Service[]>;
  getOperations(serviceContractAddress: string): Promise<readonly ServiceOperation[]>;
}
