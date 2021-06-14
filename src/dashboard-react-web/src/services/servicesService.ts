import { Service, tokenWhitelist } from '../models/blockchain';

export class ServicesService {
  getServices(): Promise<Service[]> {
    return new Promise(resolve => {
      const testServices = [{
        name: 'TestService',
        acceptTezos: true,
        tokens: [...tokenWhitelist]
      }] as Service[];

      resolve(testServices);
    });
  }
}
