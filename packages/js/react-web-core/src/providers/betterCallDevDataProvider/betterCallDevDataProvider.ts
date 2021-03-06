import BigNumber from 'bignumber.js';

import {
  converters, DonationOperation, guards, Network,
  OperationDirection, OperationStatus, OperationType, optimization, PaymentOperation, ServiceOperation,
  Service, ServiceSigningKey, tezosMeta, Token, tokenWhitelistMap
} from '@tezospayments/common';

import type { ServicesProvider } from '../servicesProvider';
import type { OperationDto, SendDonationOperationParametersDto, SendPaymentOperationParametersDto, ServiceDto, ServicesBigMapDto, ServicesFactoryDto, SigningKeyDto } from './dtos';

export class BetterCallDevDataProvider implements ServicesProvider {
  readonly tokenWhiteList: ReadonlyMap<string, Token>;

  constructor(
    readonly network: Network,
    readonly baseUrl: string,
    readonly servicesFactoryContractAddress: string,
    readonly minimumSupportedServiceVersion: number
  ) {
    this.tokenWhiteList = tokenWhitelistMap.get(this.network) || optimization.emptyMap;
  }

  async getService(serviceContractAddress: string): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/v1/contract/${this.network.name}/${serviceContractAddress}/storage`);
    const serviceDto: ServiceDto = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((+(serviceDto?.[0].children?.[serviceDto[0].children.length - 1] as any).value < this.minimumSupportedServiceVersion)) {
      // Only for Dev
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return null!;
    }

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

    return (await Promise.all(contractAddresses.map(contractAddress => this.getService(contractAddress)))).filter(Boolean);
  }

  async getOperations(serviceContractAddress: string): Promise<readonly ServiceOperation[]> {
    const url = new URL(`v1/contract/${this.network.name}/${serviceContractAddress}/operations`, this.baseUrl);
    url.searchParams.set('entrypoints', 'send_payment,send_donation');

    const response = await fetch(url.href);
    const operations: OperationDto[] = (await response.json()).operations;

    return operations
      .filter(operation => !operation.internal)
      .filter(operation => operation.entrypoint === 'send_payment' || operation.entrypoint === 'send_donation')
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map(operation => operation.entrypoint === 'send_payment'
        ? this.mapSendPaymentOperationToServiceOperation(operation as OperationDto<SendPaymentOperationParametersDto>)
        : this.mapSendDonationOperationToServiceOperation(operation as OperationDto<SendDonationOperationParametersDto>))
      .filter(Boolean);
  }

  private async getServicesFactoryDto(): Promise<ServicesFactoryDto> {
    const response = await fetch(`${this.baseUrl}/v1/contract/${this.network.name}/${this.servicesFactoryContractAddress}/storage`);
    return response.json();
  }

  private mapServiceDtoToService(serviceDto: ServiceDto, serviceAddress: string, network: Network): Service | null {
    let metadataJson: Record<string, unknown>;
    try {
      metadataJson = JSON.parse(serviceDto[0].children[4].value);
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
        version: +serviceDto[0].children[8].value,
        metadata: converters.stringToBytes(serviceDto[0].children[4].value),

        contractAddress: serviceAddress,
        network,
        allowedTokens: {
          tez: serviceDto[0].children[1].children[0].value,
          assets: optimization.emptyArray
        },
        allowedOperationType: +serviceDto[0].children[0].value,

        owner: serviceDto[0].children[5].value,
        paused: serviceDto[0].children[6].value,
        deleted: serviceDto[0].children[3].value,
        signingKeys: serviceDto[0].children[7].children
          ? this.mapSigningKeyDtosToSigningKeys(serviceDto[0].children[7].children)
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

  private mapSendPaymentOperationToServiceOperation(operationDto: OperationDto<SendPaymentOperationParametersDto>): ServiceOperation {
    const assetInfo = operationDto.parameters[0].children[1].children;
    const assetAddress = assetInfo?.[0].value;
    const assetValue = assetInfo?.[2].value;

    const decimals = assetAddress
      ? this.tokenWhiteList.get(assetAddress)?.metadata?.decimals || 0
      : tezosMeta.decimals;
    const amount = assetValue || (operationDto.amount || 0).toString();

    const paymentOperation: PaymentOperation = {
      hash: operationDto.hash,
      type: OperationType.Payment,
      direction: OperationDirection.Incoming,
      status: operationDto.status === 'applied' ? OperationStatus.Success : OperationStatus.Cancelled,
      paymentId: operationDto.parameters[0].children[0].value,
      amount: converters.numberToTokensAmount(new BigNumber(amount), decimals),
      asset: assetAddress,
      timestamp: operationDto.timestamp,
      date: new Date(operationDto.timestamp),
      sender: operationDto.source,
      target: operationDto.destination,
    };

    return paymentOperation;
  }

  private mapSendDonationOperationToServiceOperation(operationDto: OperationDto<SendDonationOperationParametersDto>): ServiceOperation {
    const assetInfo = operationDto.parameters[0].children[0].children;
    const assetAddress = assetInfo?.[0].value;
    const assetValue = assetInfo?.[2].value;

    const decimals = assetAddress
      ? this.tokenWhiteList.get(assetAddress)?.metadata?.decimals || 0
      : tezosMeta.decimals;
    const amount = assetValue || (operationDto.amount || 0).toString();

    const donationOperation: DonationOperation = {
      hash: operationDto.hash,
      type: OperationType.Donation,
      direction: OperationDirection.Incoming,
      status: operationDto.status === 'applied' ? OperationStatus.Success : OperationStatus.Cancelled,
      amount: converters.numberToTokensAmount(new BigNumber(amount), decimals),
      asset: assetAddress,
      timestamp: operationDto.timestamp,
      date: new Date(operationDto.timestamp),
      sender: operationDto.source,
      target: operationDto.destination,
      payload: DonationOperation.parsePayload(
        converters.stringToBytes(operationDto.parameters[0].children[1].value)
      )
    };

    return donationOperation;
  }
}
