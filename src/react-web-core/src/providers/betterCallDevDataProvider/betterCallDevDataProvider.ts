import BigNumber from 'bignumber.js';

import { converters, guards, Network, optimization, Service, ServiceOperation, ServiceOperationDirection, ServiceOperationStatus, ServiceSigningKey, tezosMeta } from '@tezospayments/common';

import type { ServicesProvider } from '../servicesProvider';
import type { SendPaymentOperationDto, ServiceDto, ServicesBigMapDto, ServicesFactoryDto, SigningKeyDto } from './dtos';

export class BetterCallDevDataProvider implements ServicesProvider {
  constructor(
    readonly network: Network,
    readonly baseUrl: string,
    readonly servicesFactoryContractAddress: string
  ) {
  }

  async getService(serviceContractAddress: string): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/v1/contract/${this.network.name}/${serviceContractAddress}/storage`);
    const serviceDto: ServiceDto = await response.json();

    const result = this.mapServiceDtoToService(serviceDto, serviceContractAddress, this.network);
    if (!result)
      throw new Error('Service not found');

    return result;
  }

  async getServices(ownerAddress: string): Promise<readonly Service[]> {
    const servicesFactoryDto = await this.getServicesFactoryDto();
    const servicesBigMapId = servicesFactoryDto[0].children[4].value;

    const response = await fetch(`${this.baseUrl}/v1/bigmap/${this.network.name}/${servicesBigMapId}/keys`);
    const servicesBigMapDto: ServicesBigMapDto = await response.json();
    const servicesSet = servicesBigMapDto.find(pair => pair.data.key_string === ownerAddress);

    if (!servicesSet)
      return optimization.emptyArray;

    const contractAddresses = servicesSet.data.value.children.map(serviceAddressDto => serviceAddressDto.value);

    return Promise.all(contractAddresses.map(contractAddress => this.getService(contractAddress)));
  }

  async getOperations(serviceContractAddress: string): Promise<readonly ServiceOperation[]> {
    // TODO: use URL builder
    const response = await fetch(`${this.baseUrl}/v1/contract/${this.network.name}/${serviceContractAddress}/operations?entrypoints=send_payment`);
    const operations: SendPaymentOperationDto[] = (await response.json()).operations;

    return operations.filter(operation => !operation.internal)
      .map(operation => this.mapSendPaymentOperationToServiceOperation(operation));
  }

  private async getServicesFactoryDto(): Promise<ServicesFactoryDto> {
    const response = await fetch(`${this.baseUrl}/v1/contract/${this.network.name}/${this.servicesFactoryContractAddress}/storage`);
    return response.json();
  }

  private mapServiceDtoToService(serviceDto: ServiceDto, serviceAddress: string, network: Network): Service | null {
    let metadataJson: Record<string, unknown>;
    try {
      metadataJson = JSON.parse(serviceDto[0].children[3].value);
    }
    catch {
      return null;
    }

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
        version: +serviceDto[0].children[7].value,
        metadata: converters.stringToBytes(serviceDto[0].children[3].value),

        contractAddress: serviceAddress,
        network,
        allowedTokens: {
          tez: serviceDto[0].children[1].children[0].value,
          assets: optimization.emptyArray
        },
        allowedOperationType: +serviceDto[0].children[0].value,

        owner: serviceDto[0].children[4].value,
        paused: serviceDto[0].children[5].value,
        deleted: serviceDto[0].children[2].value,
        signingKeys: serviceDto[0].children[6].children
          ? this.mapSigningKeyDtosToSigningKeys(serviceDto[0].children[6].children)
          : new Map()
      }
      : null;
  }

  private mapSigningKeyDtosToSigningKeys(signingKeyDtos: SigningKeyDto[]): Service['signingKeys'] {
    return signingKeyDtos.reduce(
      (map, signingKeyDto) => {
        const publicKey = signingKeyDto.children[0].value;
        const rawName = signingKeyDto.children[1].value;

        return map.set(publicKey, { publicKey, name: rawName !== 'None' ? rawName : undefined });
      },
      new Map<ServiceSigningKey['publicKey'], ServiceSigningKey>()
    );
  }

  private mapSendPaymentOperationToServiceOperation(operationDto: SendPaymentOperationDto): ServiceOperation {
    const rawAssetValue = operationDto.parameters[0].children[0].value;

    return {
      hash: operationDto.hash,
      type: +operationDto.parameters[0].children[1].value || 0,
      direction: ServiceOperationDirection.Incoming,
      status: operationDto.status === 'applied' ? ServiceOperationStatus.Success : ServiceOperationStatus.Cancelled,
      amount: new BigNumber(operationDto.amount.toString()).div(10 ** tezosMeta.decimals),
      payload: {
        public: ServiceOperation.parseServiceOperationPayload(converters.stringToBytes(operationDto.parameters[0].children[2].children[0].value)),
      },
      asset: rawAssetValue !== 'None' ? rawAssetValue : undefined,
      timestamp: operationDto.timestamp,
      date: new Date(operationDto.timestamp),
      sender: operationDto.source,
      target: operationDto.destination,
    };
  }
}
