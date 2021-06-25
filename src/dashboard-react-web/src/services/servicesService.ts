import { NetworkType } from '@airgap/beacon-sdk';

import { networks, Network, Service, tokenWhitelist } from '@tezos-payments/common/dist/models/blockchain';
import { wait } from '@tezos-payments/common/dist/utils';

import { Operation } from '../models/blockchain';
import { PaymentType } from '../models/blockchain/operation';

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

  getOperations(_network: NetworkType, _contractAddress: string): Promise<Operation[]> {
    return new Promise(resolve => {
      wait(1000).then(() => {
        const operations: Operation[] = [{
          id: 4872633,
          hash: 'oogXJwVGugoupXzBes9kkrBA6aK3rXskH7eXJecz8LAxCfjbNeP',
          type: 'transaction',
          amount: 10000000,
          status: 'applied',
          timestamp: '2021-06-22T08:48:37Z',
          sender: {
            address: 'tz1Pdp87Bbaeu1TaggMLVdhBM6fkv8wHrFjt'
          },
          target: {
            address: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x'
          },
          parameter: {
            entrypoint: 'send_payment',
            value: {
              payload: {
                public: '7b224f726465724964223a2231227d',
                operation_type: PaymentType.Payment,
                asset_value: null
              }
            }
          }
        }];

        resolve(operations);
      });
    });
  }
}
