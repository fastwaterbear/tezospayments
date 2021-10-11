
import BigNumber from 'bignumber.js';

import {
  converters, guards, Network, optimization,
  Service, ServiceOperation, ServiceOperationDirection,
  ServiceOperationStatus, ServiceSigningKey, tezosMeta
} from '@tezospayments/common';

import type { ServicesProvider } from '../servicesProvider';
import type { OperationDto, ServiceDto, ServicesBigMapKeyValuePairDto } from './dtos';

export class TzKTDataProvider implements ServicesProvider {
  constructor(
    readonly network: Network,
    readonly baseUrl: string,
    readonly servicesFactoryContractAddress: string
  ) {
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
    const response = await fetch(`${this.baseUrl}/v1/contracts/${this.servicesFactoryContractAddress}/bigmaps/services/keys/${ownerAddress}`);
    const keyValue: ServicesBigMapKeyValuePairDto = await response.json();
    const contractAddresses = keyValue.value;

    const rawContractsInfoPromises = contractAddresses.map(v => fetch(`${this.baseUrl}v1/contracts/${v}/storage`).then(r => r.json()));
    const rawContractsInfo = await Promise.all<ServiceDto>(rawContractsInfoPromises);

    return rawContractsInfo
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((s, i) => this.mapServiceDtoToService(s, contractAddresses[i]!, this.network))
      .filter((s): s is Service => !!s);
  }

  async getOperations(serviceContractAddress: string): Promise<readonly ServiceOperation[]> {
    // TODO: use URL builder
    const response = await fetch(`${this.baseUrl}/v1/accounts/${serviceContractAddress}/operations?type=transaction&parameters.as=*%22entrypoint%22:%22send_payment%22*`);
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
    const resultMap = new Map<ServiceSigningKey['publicKey'], ServiceSigningKey>();

    return signingKeyDtos
      ? Object.keys(signingKeyDtos)
        .reduce(
          (map, signingKey) => map.set(signingKey, { publicKey: signingKey, name: signingKeyDtos[signingKey]?.name || undefined }),
          resultMap
        )
      : resultMap;
  }

  private mapOperationToServiceOperation(operationDto: OperationDto): ServiceOperation {
    return {
      hash: operationDto.hash,
      type: +operationDto.parameter.value.operation_type || 0,
      direction: ServiceOperationDirection.Incoming,
      status: operationDto.status === 'applied' ? ServiceOperationStatus.Success : ServiceOperationStatus.Cancelled,
      amount: new BigNumber(operationDto.amount.toString()).div(10 ** tezosMeta.decimals),
      payload: {
        public: ServiceOperation.parseServiceOperationPayload(operationDto.parameter.value.payload.public),
      },
      asset: undefined,
      timestamp: operationDto.timestamp,
      date: new Date(operationDto.timestamp),
      sender: operationDto.sender.address,
      target: operationDto.target.address,
    };
  }
}
