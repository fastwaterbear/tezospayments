import { BeaconWallet } from '@taquito/beacon-wallet';
import { MichelsonMap, TezosToolkit, TransactionWalletOperation } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {
  tezosMeta, Network,
  Service, ServiceOperation, ServiceOperationDirection,
  ServiceOperationStatus, ServiceDto, ServicesBigMapKeyValuePair,
  converters, guards, optimization, wait, ServiceSigningKey
} from '@tezospayments/common';

import { config } from '../../config';
import { Account } from '../../models/blockchain';
import type { ServiceFactoryStorage } from '../../models/contracts';
import type { Operation } from './operation';

export class ServicesService {
  private readonly tezosWallet: BeaconWallet;
  private readonly tezosToolKitByNetwork: Map<Network, TezosToolkit> = new Map<Network, TezosToolkit>();

  constructor(tezosWallet: BeaconWallet) {
    this.tezosWallet = tezosWallet;
  }

  async getServices(account: Account): Promise<Service[]> {
    try {
      const networkConfig = config.tezos.networks[account.network.name];
      const indexerUrl = networkConfig.indexerUrls[networkConfig.default.indexer];
      const response = await fetch(`${indexerUrl}v1/contracts/${networkConfig.servicesFactoryContractAddress}/bigmaps/services/keys/${account.address}`);
      const keyValue: ServicesBigMapKeyValuePair = await response.json();
      const contractAddresses = keyValue.value;

      const rawContractsInfoPromises = contractAddresses.map(v => fetch(`${indexerUrl}v1/contracts/${v}/storage`).then(r => r.json()));
      const rawContractsInfo = await Promise.all(rawContractsInfoPromises) as ServiceDto[];
      const result = rawContractsInfo.map((s, i) => this.mapServiceDtoToService(s, contractAddresses[i] || '', account.network));

      return result.filter(s => s) as Service[];
    } catch {
      return [];
    }
  }

  async updateService(service: Service): Promise<TransactionWalletOperation | null> {
    try {
      const tezosToolkit = this.getTezosToolKit(service.network);
      const factoryContract = await tezosToolkit.wallet.at(service.contractAddress);

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

  async setPaused(service: Service, paused: boolean): Promise<TransactionWalletOperation | null> {
    try {
      const tezosToolkit = this.getTezosToolKit(service.network);
      const factoryContract = await tezosToolkit.wallet.at(service.contractAddress);

      if (factoryContract.methods.set_pause) {
        const operation = await factoryContract.methods.set_pause(paused).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async setDeleted(service: Service, deleted: boolean): Promise<TransactionWalletOperation | null> {
    try {
      const tezosToolkit = this.getTezosToolKit(service.network);
      const factoryContract = await tezosToolkit.wallet.at(service.contractAddress);

      if (factoryContract.methods.set_deleted) {
        const operation = await factoryContract.methods.set_deleted(deleted).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async createService(service: Service): Promise<TransactionWalletOperation | null> {
    try {
      const networkConfig = config.tezos.networks[service.network.name];
      const tezosToolkit = this.getTezosToolKit(service.network);
      const factoryContract = await tezosToolkit.contract.at(networkConfig.servicesFactoryContractAddress);

      const factoryStorage = await factoryContract.storage<ServiceFactoryStorage>();
      const factoryImplementationContract = await tezosToolkit.wallet.at(factoryStorage.factory_implementation);

      if (factoryImplementationContract.methods.create_service) {
        const encodedServiceMetadata = this.encodeMetadata(service);

        const operation = await factoryImplementationContract.methods.create_service(
          encodedServiceMetadata,
          service.allowedTokens.tez,
          service.allowedTokens.assets,
          service.allowedOperationType,
          new MichelsonMap()
        ).send();

        return operation;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async addApiKey(_service: Service, _signingKey: ServiceSigningKey): Promise<void> {
    await wait(1000);
  }

  async deleteApiKey(_service: Service, _publicKey: string): Promise<void> {
    await wait(1000);
  }

  async getOperations(network: Network, contractAddress: string): Promise<ServiceOperation[]> {
    const networkConfig = config.tezos.networks[network.name];
    const indexerUrl = networkConfig.indexerUrls[networkConfig.default.indexer];
    const response = await fetch(`${indexerUrl}v1/accounts/${contractAddress}/operations?type=transaction&parameters.as=*%22entrypoint%22:%22send_payment%22*`);
    const operations: Operation[] = await response.json();

    return operations.map(operation => this.mapOperationToServiceOperation(operation));
  }

  private getTezosToolKit(network: Network): TezosToolkit {
    let tezosToolkit = this.tezosToolKitByNetwork.get(network);
    if (!tezosToolkit) {
      const networkConfig = config.tezos.networks[network.name];
      tezosToolkit = new TezosToolkit(networkConfig.rpcUrls[networkConfig.default.rpc]);
      tezosToolkit.setWalletProvider(this.tezosWallet);
      this.tezosToolKitByNetwork.set(network, tezosToolkit);
    }
    return tezosToolkit;
  }

  private encodeMetadata(service: Service) {
    const serviceMetadata = {
      name: service.name || undefined,
      links: service.links.length ? service.links : undefined,
      description: service.description || undefined,
      iconUrl: service.iconUrl || undefined
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
      && (typeof metadataJson.iconUrl === 'string' || metadataJson.iconUrl === undefined)
    )
      ? {
        name: metadataJson.name,
        links: metadataJson.links || optimization.emptyArray,
        description: metadataJson.description,
        iconUrl: metadataJson.iconUrl,
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
        deleted: serviceDto.deleted,
        signingKeys: this.mapSigningKeyDtosToSigningKeys(serviceDto.signing_keys)
      }
      : null;
  }

  private mapSigningKeyDtosToSigningKeys(signingKeyDtos: ServiceDto['signing_keys']): Service['signingKeys'] {
    const resultMap = new Map<ServiceSigningKey['publicKey'], ServiceSigningKey>();
    if (!signingKeyDtos)
      return resultMap;

    return signingKeyDtos
      ? Object.keys(signingKeyDtos)
        .reduce(
          (map, signingKey) => map.set(signingKey, { publicKey: signingKey, name: signingKeyDtos[signingKey]?.name || undefined }),
          resultMap
        )
      : resultMap;
  }
}
