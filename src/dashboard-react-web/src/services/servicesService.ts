import { Service, TOKEN_WHITELIST } from '../models/blockchain';

export class ServicesService {
  getServices(): Promise<Service[]> {
    return new Promise(resolve => {
      const testServices = [{
        name: 'TestService',
        acceptTezos: true,
        tokens: [...TOKEN_WHITELIST]
      }] as Service[];

      resolve(testServices);
    });
  }
}
