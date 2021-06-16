import { wait } from '@tezos-payments/common/dist/utils';

import { Service, tokenWhitelist } from '../models/blockchain';

export class ServicesService {
  getServices(): Promise<Service[]> {
    return new Promise(resolve => {
      wait(1000).then(() => {
        const testServices = [{
          name: 'TestService',
          acceptTezos: true,
          tokens: [...tokenWhitelist]
        }] as Service[];

        resolve(testServices);
      });
    });
  }
}
