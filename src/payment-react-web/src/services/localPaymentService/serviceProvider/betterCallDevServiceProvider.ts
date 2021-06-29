import { Network } from '@tezos-payments/common/dist/models/blockchain';
import { Service } from '@tezos-payments/common/dist/models/service';
import { converters, guards, optimization } from '@tezos-payments/common/dist/utils';

import { ServiceResult } from '../../serviceResult';
import { LocalPaymentServiceError } from '../errors';
import { ServiceProvider } from './serviceProvider';

export class BetterCallDevServiceProvider implements ServiceProvider {
  readonly baseUrl = 'https://api.better-call.dev';

  constructor(readonly network: Network) {
  }

  async getService(serviceAddress: string): Promise<ServiceResult<Service, LocalPaymentServiceError>> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/contract/${this.network.name}/${serviceAddress}/storage`);
      if (!response.ok)
        return { isServiceError: true, error: await response.text() };

      const serviceStorage: ServiceStorage = await response.json();
      const service = this.mapServiceStorageToService(serviceStorage, serviceAddress);

      return service ?? { isServiceError: true, error: 'Service is invalid' };
    }
    catch (error: unknown) {
      return { isServiceError: true, error: (error as Error).message };
    }
  }

  private mapServiceStorageToService(serviceStorage: ServiceStorage, serviceAddress: string): Service | null {
    let metadataJson: Record<string, unknown>;
    try {
      metadataJson = JSON.parse(serviceStorage[0].children[3].value);
    }
    catch {
      return null;
    }

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
        version: +serviceStorage[0].children[6].value,
        metadata: converters.stringToBytes(serviceStorage[0].children[3].value),

        contractAddress: serviceAddress,
        network: this.network,
        allowedTokens: {
          tez: serviceStorage[0].children[1].children[0].value,
          assets: optimization.emptyArray
        },
        allowedOperationType: +serviceStorage[0].children[0].value,

        owner: serviceStorage[0].children[4].value,
        paused: serviceStorage[0].children[5].value,
        deleted: serviceStorage[0].children[2].value
      }
      : null;
  }
}

export type ServiceStorage = [
  {
    prim: 'pair',
    type: 'namedtuple',
    name: '@pair_1',
    children: [
      // 0
      {
        prim: 'nat',
        type: 'nat',
        name: 'allowed_operation_type',
        value: '1' | '2' | '3'
      },
      // 1
      {
        prim: 'pair',
        type: 'namedtuple',
        name: 'allowed_tokens',
        children: [
          {
            prim: 'bool',
            type: 'bool',
            name: 'tez',
            value: boolean
          },
          {
            prim: 'set',
            type: 'set',
            name: 'assets'
          }
        ]
      },
      // 2
      {
        prim: 'bool',
        type: 'bool',
        name: 'deleted',
        value: boolean
      },
      // 3
      {
        prim: 'bytes',
        type: 'bytes',
        name: 'metadata',
        value: string
      },
      // 4
      {
        prim: 'address',
        type: 'address',
        name: 'owner',
        value: string
      },
      // 5
      {
        prim: 'bool',
        type: 'bool',
        name: 'paused',
        value: boolean
      },
      // 6
      {
        prim: 'nat',
        type: 'nat',
        name: 'version',
        value: string
      }
    ]
  }
];
