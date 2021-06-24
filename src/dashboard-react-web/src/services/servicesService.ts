import { networks, Network, Service, tokenWhitelist } from '@tezos-payments/common/dist/models/blockchain';
import { wait } from '@tezos-payments/common/dist/utils';

export class ServicesService {
  getServices(network: Network): Promise<Service[]> {
    return new Promise(resolve => {
      wait(1000).then(() => {
        const testServices: Service[] = [{
          name: 'Test Service of Fast Water Bear',
          links: [
            'https://github.com/fastwaterbear',
            'https://t.me/fastwaterbear'
          ],
          iconUri: 'https://avatars.githubusercontent.com/u/82229602',
          version: 1,
          metadata: '7b226e616d65223a22546573742053657276696365206f6620466173742057617465722042656172227d',
          contractAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          network: networks.edo2net,
          allowedTokens: {
            tez: true,
            assets: tokenWhitelist.filter(t => t.network === network).map(t => t.contractAddress)
          },
          owner: 'tz1aANkwuYKxB1XCyhB3CjMDDBQuPmNcBcCc',
          deleted: false,
          paused: false,
        }];

        resolve(testServices);
      });
    });
  }
}
