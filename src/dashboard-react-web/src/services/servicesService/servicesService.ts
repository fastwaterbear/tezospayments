import { ColorMode, NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { networks, Network, tokenWhitelist, tezosMeta } from '@tezospayments/common/dist/models/blockchain';
import {
  Service, ServiceOperationType, ServiceOperation, ServiceOperationDirection, ServiceOperationStatus
} from '@tezospayments/common/dist/models/service';
import { wait } from '@tezospayments/common/dist/utils';

import { config } from '../../config';
import type { Operation } from './operation';

export class ServicesService {
  private readonly factoryContractAddress = 'KT1PXyQ3wDpwm6J3r6iyLCWu5QKH5tef7ejU';

  readonly tezosToolkit = new TezosToolkit('https://edonet.smartpy.io/');
  readonly tezosWallet = new BeaconWallet({ name: config.app.name, colorMode: ColorMode.LIGHT });

  constructor() {
    this.tezosToolkit.setWalletProvider(this.tezosWallet);
  }

  getServices(_network: Network): Promise<Service[]> {
    return new Promise(resolve => {
      wait(1000).then(() => {
        resolve(testServices);
      });
    });
  }

  async updateService(service: Service): Promise<TransactionWalletOperation | null> {
    try {
      const factoryContract = await this.tezosToolkit.wallet.at(service.contractAddress);

      if (factoryContract.methods.update_service_parameters) {
        const encodedServiceMetadata = this.encodeMetadata(service);

        const operation = await factoryContract.methods.update_service_parameters(
          encodedServiceMetadata,
          service.allowedTokens.tez,
          service.allowedTokens.assets,
          service.allowedOperationType
        ).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async createService(service: Service): Promise<TransactionWalletOperation | null> {
    try {
      const factoryContract = await this.tezosToolkit.wallet.at(this.factoryContractAddress);

      if (factoryContract.methods.create_service) {
        const encodedServiceMetadata = this.encodeMetadata(service);

        const operation = await factoryContract.methods.create_service(
          encodedServiceMetadata,
          service.allowedTokens.tez,
          service.allowedTokens.assets,
          service.allowedOperationType
        ).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async getOperations(network: NetworkType, contractAddress: string): Promise<ServiceOperation[]> {
    const response = await fetch(`https://${this.getTzktUrl(network)}/v1/accounts/${contractAddress}/operations?type=transaction&parameters.as=*%22entrypoint%22:%22send_payment%22*`);
    const operations: Operation[] = await response.json();

    return operations.map(operation => this.mapOperationToServiceOperation(operation));
  }

  private encodeMetadata(service: Service) {
    const serviceMetadata = {
      name: service.name || undefined,
      links: service.links.length ? service.links : undefined,
      description: service.description || undefined,
      iconUrl: service.iconUri || undefined
    };

    return Buffer.from(JSON.stringify(serviceMetadata), 'utf8').toString('hex');
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

const testServices: Service[] = [{
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
  contractAddress: 'KT1BQWbm77qsvSsSB8jNZcwjNEipN1kNc29R',
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
