import { wait } from '@tezos-payments/common/dist/utils';

import { Network, Service, tokenWhitelist } from '../models/blockchain';

export class ServicesService {
  getServices(network: Network): Promise<Service[]> {
    return new Promise(resolve => {
      wait(1000).then(() => {
        const testServices = [{
          name: 'TestService',
          acceptTezos: true,
          tokens: tokenWhitelist.filter(t => t.network === network)
        }] as Service[];

        resolve(testServices);
      });
    });
  }
}
