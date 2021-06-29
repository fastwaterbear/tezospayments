import { Network } from '@tezos-payments/common/dist/models/blockchain';
import { Service } from '@tezos-payments/common/dist/models/service';
import { converters, guards, optimization } from '@tezos-payments/common/dist/utils';

import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';
import { ServiceProvider } from './serviceProvider';

export abstract class IndexerServiceProvider implements ServiceProvider {
  constructor(readonly baseUrl: string, readonly network: Network) {
  }

  async getService(serviceAddress: string): Promise<ServiceResult<Service, LocalPaymentServiceError>> {
    try {
      const serviceDtoResult = await this.getServiceInternal(serviceAddress);
      if (serviceDtoResult.isServiceError)
        return serviceDtoResult;

      const service = this.mapServiceDtoToService(serviceDtoResult, serviceAddress);

      return service ?? { isServiceError: true, error: 'Service is invalid' };
    }
    catch (error: unknown) {
      return { isServiceError: true, error: (error as Error).message };
    }
  }

  protected abstract getServiceInternal(serviceAddress: string): Promise<ServiceResult<ServiceDto, LocalPaymentServiceError>>;

  private mapServiceDtoToService(serviceDto: ServiceDto, serviceAddress: string): Service | null {
    const metadataJson = converters.bytesToObject(serviceDto.metadata);

    // TODO: use the service validation
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

export interface ServiceDto {
  readonly owner: string;
  readonly paused: boolean;
  readonly deleted: boolean;
  readonly version: string;
  readonly metadata: string;
  readonly allowed_tokens: {
    readonly tez: boolean;
    readonly assets: readonly string[];
  };
  readonly allowed_operation_type: string,
}
