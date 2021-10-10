import type { Service } from '@tezospayments/common';

export interface ServicesProvider {
  getService(serviceContractAddress: string): Promise<Service>;
  getServices(ownerAddress: string): Promise<Service[]>;
}
