import { NetworkType } from '@airgap/beacon-sdk';
import { BigNumber } from 'bignumber.js';

import { networks, Network, tokenWhitelist, tezosMeta } from '@tezos-payments/common/dist/models/blockchain';
import {
  Service, ServiceOperationType, ServiceOperation, ServiceOperationDirection, ServiceOperationStatus
} from '@tezos-payments/common/dist/models/service';
import { wait } from '@tezos-payments/common/dist/utils';

import type { Operation } from './operation';

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
          allowedOperationType: ServiceOperationType.All,
          owner: 'tz1aANkwuYKxB1XCyhB3CjMDDBQuPmNcBcCc',
          deleted: false,
          paused: false,
        }];

        resolve(testServices);
      });
    });
  }

  async getOperations(_network: NetworkType, contractAddress: string): Promise<ServiceOperation[]> {
    const response = await fetch(`https://api.edo2net.tzkt.io/v1/accounts/${contractAddress}/operations?type=transaction&parameters.as=*%22entrypoint%22:%22send_payment%22*`);
    const operations: Operation[] = await response.json();

    return operations.map(operation => this.mapOperationToServiceOperation(operation));
  }

  private mapOperationToServiceOperation(operation: Operation): ServiceOperation {
    return {
      hash: operation.hash,
      type: operation.parameter.value.payload.operation_type,
      direction: ServiceOperationDirection.Incoming,
      status: operation.status === 'applied' ? ServiceOperationStatus.Success : ServiceOperationStatus.Cancelled,
      amount: new BigNumber(operation.amount.toString()).div(10 ** tezosMeta.decimals),
      payload: {
        public: {
          // TODO
          value: undefined,
          encodedValue: operation.parameter.value.payload.public
        }
      },
      asset: undefined,
      timestamp: operation.timestamp,
      date: new Date(operation.timestamp),
      sender: operation.sender.address,
      target: operation.target.address,
    };
  }
}
