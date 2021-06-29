import { Network, networks } from '@tezos-payments/common/dist/models/blockchain';
import { Service } from '@tezos-payments/common/dist/models/service';
import { converters, guards } from '@tezos-payments/common/dist/utils';

import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';
import { ServiceProvider } from './serviceProvider';

export class TzStatsServiceProvider implements ServiceProvider {
  private static readonly defaultBaseUrl = 'https://api.tzstats.com';
  private static readonly networkBaseUrlMap: ReadonlyMap<Network['id'], string> = new Map<Network['id'], string>()
    .set(networks.main.id, 'https://api.tzstats.com')
    .set(networks.florence.id, 'https://api.florence.tzstats.com')
    .set(networks.edo2net.id, 'https://api.edo.tzstats.com');

  readonly baseUrl: string;

  constructor(readonly network: Network) {
    this.baseUrl = TzStatsServiceProvider.networkBaseUrlMap.get(this.network.id) || TzStatsServiceProvider.defaultBaseUrl;
  }

  async getService(serviceAddress: string): Promise<ServiceResult<Service, LocalPaymentServiceError>> {
    try {
      const response = await fetch(`${this.baseUrl}/explorer/contract/${serviceAddress}/storage`);

      if (!response.ok)
        return { isServiceError: true, error: await response.text() };

      const serviceContractStorage: ServiceContractStorage = await response.json();
      const service = this.mapServiceDtoToService(serviceContractStorage.value, serviceAddress);

      return service ?? { isServiceError: true, error: 'Service is invalid' };
    }
    catch (error: unknown) {
      return { isServiceError: true, error: (error as Error).message };
    }
  }

  private mapServiceDtoToService(serviceDto: ServiceDto, serviceAddress: string,): Service | null {
    const metadataJson = converters.bytesToObject(serviceDto.metadata);
    console.log(metadataJson);
    // TODO: use the service validation
    return (metadataJson && typeof metadataJson.name === 'string'
      && (guards.isArray(metadataJson.links) || metadataJson.links === undefined)
      && (typeof metadataJson.description === 'string' || metadataJson.description === undefined)
      && (typeof metadataJson.iconUri === 'string' || metadataJson.iconUri === undefined)
    )
      ? {
        name: metadataJson.name,
        links: metadataJson.links || [],
        description: metadataJson.description,
        iconUri: metadataJson.iconUri,
        version: +serviceDto.version,
        metadata: serviceDto.metadata,

        contractAddress: serviceAddress,
        network: this.network,
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
}

interface ServiceContractStorage {
  readonly value: ServiceDto;
}

interface ServiceDto {
  readonly metadata: string;
  readonly allowed_operation_type: string,
  readonly allowed_tokens: {
    readonly assets: readonly string[],
    readonly tez: boolean;
  };
  readonly version: string;
  readonly deleted: boolean;
  readonly owner: string;
  readonly paused: boolean;
}
