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
        }, {
          name: 'Maxima-net Service',
          links: [
            'https://github.com/fastwaterbear',
            'https://t.me/fastwaterbear'
          ],
          version: 1,
          metadata: '7b226e616d65223a22546573742053657276696365206f6620466173742057617465722042656172227d',
          contractAddress: 'KT1J5rMCDMG2iHfA4EhpKdFyQVQAVY8wHf6x',
          network: networks.edo2net,
          allowedTokens: {
            tez: true,
            assets: tokenWhitelist.filter(t => t.network === network).map(t => t.contractAddress)
          },
          allowedOperationType: ServiceOperationType.Payment,
          owner: 'tz1aANkwuYKxB1XCyhB3CjMDDBQuPmNcBcCc',
          deleted: false,
          paused: true,
        }];

        resolve(testServices);
      });
    });
  }

  async getOperations(network: NetworkType, contractAddress: string): Promise<ServiceOperation[]> {
    const response = await fetch(`https://${this.getTzktUrl(network)}/v1/accounts/${contractAddress}/operations?type=transaction&parameters.as=*%22entrypoint%22:%22send_payment%22*`);
    const operations: Operation[] = await response.json();

    return operations.map(operation => this.mapOperationToServiceOperation(operation));
  }

  private mapOperationToServiceOperation(operation: Operation): ServiceOperation {
    return {
      hash: operation.hash,
      type: +operation.parameter.value.operation_type || 0,
      direction: ServiceOperationDirection.Incoming,
      status: operation.status === 'applied' ? ServiceOperationStatus.Success : ServiceOperationStatus.Cancelled,
      amount: new BigNumber(operation.amount.toString()).div(10 ** tezosMeta.decimals),
      payload: {
        public: ServiceOperation.parseServiceOperationPayload(operation.parameter.value.payload.public),
      },
      asset: undefined,
      timestamp: operation.timestamp,
      date: new Date(operation.timestamp),
      sender: operation.sender.address,
      target: operation.target.address,
    };
  }

  private getTzktUrl(network: NetworkType) {
    switch (network) {
      case NetworkType.EDONET:
        return 'api.edo2net.tzkt.io';

      default:
        throw new Error('Not Supported network type');
    }
  }
}
