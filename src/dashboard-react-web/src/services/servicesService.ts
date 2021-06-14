import { Service, tokenWhitelist } from '../models/blockchain';

export class ServicesService {
  getServices(): Promise<Service[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const testServices = [{
          name: 'TestService',
          acceptTezos: true,
          tokens: [...tokenWhitelist]
        }] as Service[];

        resolve(testServices);
      }, 2000);
    });
  }
}
