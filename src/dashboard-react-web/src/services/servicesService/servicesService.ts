import { NetworkType } from '@airgap/beacon-sdk';
import { BigNumber } from 'bignumber.js';

import { networks, Network, tokenWhitelist, tezosMeta } from '@tezospayments/common/dist/models/blockchain';
import {
  Service, ServiceOperationType, ServiceOperation, ServiceOperationDirection, ServiceOperationStatus
} from '@tezospayments/common/dist/models/service';
import { wait } from '@tezospayments/common/dist/utils';

import type { Operation } from './operation';

export class ServicesService {
  getServices(_network: Network): Promise<Service[]> {
    return new Promise(resolve => {
      wait(1000).then(() => {
        resolve(testServices);
      });
    });
  }

  async updateService(service: Service): Promise<void> {
    return new Promise(resolve => {
      wait(1000).then(() => {
        testServices = testServices.map(s => {
          if (s.contractAddress === service.contractAddress) {
            return {
              ...s,
              allowedOperationType: service.allowedOperationType,
              allowedTokens: service.allowedTokens,
              contractAddress: service.contractAddress,
              deleted: service.deleted,
              description: service.description,
              iconUri: service.iconUri,
              links: service.links,
              metadata: service.metadata,
              name: service.name,
              network: service.network,
              owner: service.owner,
              paused: service.paused,
              version: service.version,
            } as Service;
          } else {
            return s;
          }
        });

        resolve();
      });
    });
  }

  async createService(service: Service): Promise<void> {
    return new Promise(resolve => {
      wait(1000).then(() => {
        service = { ...service, contractAddress: `KT1J5rMCDMG2iHfA4EhpKdFyQVQAVY8wHf6${testServices.length + 1}` };
        testServices = [...testServices, service];

        resolve();
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

let testServices: Service[] = [{
  name: 'Test Service of Fast Water Bear',
  links: [
    'https://github.com/fastwaterbear',
    'https://t.me/fastwaterbear'
  ],
  description: 'This is a test service of Fast Water Bear which provides basics information and scenarios to debug and investigate',
  iconUri: 'https://avatars.githubusercontent.com/u/82229602',
  version: 1,
  metadata: '7b226e616d65223a22546573742053657276696365206f6620466173742057617465722042656172227d',
  contractAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
  network: networks.edo2net,
  allowedTokens: {
    tez: true,
    assets: tokenWhitelist.filter(t => t.network === networks.edo2net).map(t => t.contractAddress)
  },
  allowedOperationType: ServiceOperationType.All,
  owner: 'tz1aANkwuYKxB1XCyhB3CjMDDBQuPmNcBcCc',
  deleted: false,
  paused: false,
}, {
  name: 'Maxima-net Service',
  // eslint-disable-next-line
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam scelerisque leo ut dignissim posuere. Phasellus condimentum dui id felis posuere, eu tincidunt ipsum euismod. Aliquam erat volutpat. Vivamus vitae diam finibus metus finibus vestibulum. Quisque at facilisis nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tincidunt urna a ex consectetur, quis malesuada nunc scelerisque. Nulla ultricies dolor vel velit pulvinar scelerisque. Pellentesque vehicula sodales erat laoreet iaculis. Vivamus egestas ligula at aliquam condimentum. Aliquam erat volutpat. Sed a gravida justo. Ut porttitor velit sit amet tellus blandit faucibus. Sed lobortis tristique enim non iaculis. Donec ac sapien eu nunc posuere semper quis mollis mi. Phasellus at libero ac neque finibus finibus id eu mauris.',
  links: [
    'https://github.com/fastwaterbear',
    'https://t.me/fastwaterbear',
    'https://abc.com',
  ],
  version: 1,
  metadata: '7b226e616d65223a22546573742053657276696365206f6620466173742057617465722042656172227d',
  contractAddress: 'KT1J5rMCDMG2iHfA4EhpKdFyQVQAVY8wHf6x',
  network: networks.edo2net,
  allowedTokens: {
    tez: true,
    assets: tokenWhitelist.filter(t => t.network === networks.edo2net).map(t => t.contractAddress)
  },
  allowedOperationType: ServiceOperationType.Payment,
  owner: 'tz1aANkwuYKxB1XCyhB3CjMDDBQuPmNcBcCc',
  deleted: false,
  paused: true,
}];
