import { Network, networks } from '../blockchain/network';
import { ServiceOperationType } from './serviceOperationType';
import { ServiceSigningKey } from './serviceSigningKey';

export interface Service {
  readonly name: string;
  readonly links: readonly string[];
  readonly description?: string;
  readonly iconUrl?: string;
  readonly version: number;
  readonly metadata: string;

  readonly contractAddress: string;
  readonly network: Network;
  readonly allowedTokens: {
    readonly tez: boolean;
    readonly assets: readonly string[];
  }
  readonly allowedOperationType: ServiceOperationType;

  readonly owner: string;
  readonly paused: boolean;
  readonly deleted: boolean;
  readonly signingKeys: { readonly [key: string]: ServiceSigningKey };
}

export const emptyService: Service = {
  name: '',
  description: '',
  links: [],
  version: 0,
  metadata: '',
  contractAddress: '',
  allowedTokens: {
    tez: true,
    assets: []
  },
  allowedOperationType: ServiceOperationType.Payment,
  owner: '',
  paused: false,
  deleted: false,
  network: networks.granadanet,
  signingKeys: {}
};
