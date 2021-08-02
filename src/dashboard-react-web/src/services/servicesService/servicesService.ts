import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, TransactionWalletOperation } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { networks, tezosMeta, Network } from '@tezospayments/common/dist/models/blockchain';
import {
  Service, ServiceOperation, ServiceOperationDirection, ServiceOperationStatus, ServiceDto, ServicesBigMapKeyValuePair
} from '@tezospayments/common/dist/models/service';
import { converters, guards, optimization } from '@tezospayments/common/dist/utils';

import type { Operation } from './operation';

export class ServicesService {
  private readonly factoryContractAddress = 'KT1PXyQ3wDpwm6J3r6iyLCWu5QKH5tef7ejU';
  private readonly tezosToolkit = new TezosToolkit('https://edonet.smartpy.io/');
  private readonly tezosWallet: BeaconWallet;

  constructor(tezosWallet: BeaconWallet) {
    this.tezosWallet = tezosWallet;
    this.tezosToolkit.setWalletProvider(this.tezosWallet);
  }

  async getServices(network: Network, accountAddress: string): Promise<Service[]> {
    const response = await fetch(`https://${this.getTzktUrl(network)}/v1/contracts/${this.factoryContractAddress}/bigmaps/services/keys/${accountAddress}`);
    const keyValue: ServicesBigMapKeyValuePair = await response.json();
    const contractAddresses = keyValue.value;

    const rawContractsInfoPromises = contractAddresses.map(v => fetch(`https://${this.getTzktUrl(network)}/v1/contracts/${v}/storage`).then(r => r.json()));
    const rawContractsInfo = await Promise.all(rawContractsInfoPromises) as ServiceDto[];
    console.log(rawContractsInfo);

    const result = rawContractsInfo.map((s, i) => this.mapServiceDtoToService(s, contractAddresses[i] || '', network));

    return result.filter(s => s) as Service[];
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

  async getOperations(network: Network, contractAddress: string): Promise<ServiceOperation[]> {
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

  private mapServiceDtoToService(serviceDto: ServiceDto, serviceAddress: string, network: Network): Service | null {
    const metadataJson = converters.bytesToObject(serviceDto.metadata);

    return (metadataJson && typeof metadataJson.name === 'string'
      && (guards.isArray(metadataJson.links) || metadataJson.links === undefined)
      && (typeof metadataJson.description === 'string' || metadataJson.description === undefined)
      && (typeof metadataJson.iconUri === 'string' || metadataJson.iconUri === undefined)
    )
      ? {
        name: metadataJson.name,
        links: metadataJson.links || optimization.emptyArray,
        description: metadataJson.description,
        iconUri: metadataJson.iconUri,
        version: +serviceDto.version,
        metadata: serviceDto.metadata,

        contractAddress: serviceAddress,
        network,
        allowedTokens: {
          tez: serviceDto.allowed_tokens.tez,
          assets: serviceDto.allowed_tokens.assets
        },
        allowedOperationType: +serviceDto.allowed_operation_type,

        owner: serviceDto.owner,
        paused: serviceDto.paused,
        deleted: serviceDto.deleted
      }
      : null;
  }

  private getTzktUrl(network: Network) {
    switch (network) {
      case networks.edo2net:
        return 'api.edo2net.tzkt.io';

      default:
        throw new Error('Not Supported network type');
    }
  }
}
