
import BigNumber from 'bignumber.js';

import {
  converters, guards, Network, optimization,
  Service, ServiceOperation, ServiceOperationDirection,
  ServiceOperationStatus, ServiceSigningKey, tezosMeta, Token, tokenWhitelistMap
} from '@tezospayments/common';

import type { ServicesProvider } from '../servicesProvider';
import type { OperationDto, ServiceDto, ServicesBigMapKeyValuePairDto } from './dtos';

export class TzKTDataProvider implements ServicesProvider {
  readonly tokenWhiteList: ReadonlyMap<string, Token>;

  constructor(
    readonly network: Network,
    readonly baseUrl: string,
    readonly servicesFactoryContractAddress: string,
  ) {
    this.tokenWhiteList = tokenWhitelistMap.get(this.network) || optimization.emptyMap;
  }

  async getService(serviceContractAddress: string): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/v1/contracts/${serviceContractAddress}/storage`);
    const serviceDto: ServiceDto = await response.json();

    const result = this.mapServiceDtoToService(serviceDto, serviceContractAddress, this.network);
    if (!result)
      throw new Error('Service not found');

    return result;
  }

  async getServices(ownerAddress: string): Promise<readonly Service[]> {
    const keysUrl = `${this.baseUrl}/v1/contracts/${this.servicesFactoryContractAddress}/bigmaps/services/keys`;
    const allKeysResponse = await fetch(keysUrl);
    const allKeys: ServicesBigMapKeyValuePairDto[] = await allKeysResponse.json();
    if (allKeys.every(k => k.key !== ownerAddress)) {
      return [];
    }

    const response = await fetch(`${keysUrl}/${ownerAddress}`);
    const keyValue: ServicesBigMapKeyValuePairDto = await response.json();
    const contractAddresses = keyValue.value;

    return Promise.all(contractAddresses.map(contractAddress => this.getService(contractAddress)));
  }

  async getOperations(serviceContractAddress: string): Promise<readonly ServiceOperation[]> {
    const url = new URL(`v1/accounts/${serviceContractAddress}/operations`, this.baseUrl);
    url.searchParams.set('type', 'transaction');
    url.searchParams.set('entrypoint', 'send_payment');

    const response = await fetch(url.href);
    const operations: OperationDto[] = await response.json();

    return operations.map(operation => this.mapOperationToServiceOperation(operation));
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
    return Object.keys(signingKeyDtos)
      .reduce(
        (map, signingKey) => map.set(signingKey, { publicKey: signingKey, name: signingKeyDtos[signingKey]?.name || undefined }),
        new Map<ServiceSigningKey['publicKey'], ServiceSigningKey>()
      );
  }

  private mapOperationToServiceOperation(operationDto: OperationDto): ServiceOperation {
    const decimals = operationDto.parameter.value.asset_value
      ? this.tokenWhiteList.get(operationDto.parameter.value.asset_value.token_address)?.metadata?.decimals || 0
      : tezosMeta.decimals;

    const amount = operationDto.parameter.value.asset_value ? operationDto.parameter.value.asset_value.value : operationDto.amount.toString();

    return {
      hash: operationDto.hash,
      type: +operationDto.parameter.value.operation_type || 0,
      direction: ServiceOperationDirection.Incoming,
      status: operationDto.status === 'applied' ? ServiceOperationStatus.Success : ServiceOperationStatus.Cancelled,
      amount: new BigNumber(amount).div(10 ** decimals),
      payload: {
        public: ServiceOperation.parseServiceOperationPayload(operationDto.parameter.value.payload.public),
      },
      asset: operationDto.parameter.value.asset_value?.token_address,
      timestamp: operationDto.timestamp,
      date: new Date(operationDto.timestamp),
      sender: operationDto.sender.address,
      target: operationDto.target.address,
    };
  }
}
