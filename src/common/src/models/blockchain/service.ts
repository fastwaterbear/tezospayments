import { Network } from './network';

export interface Service {
  readonly name: string;
  readonly links: readonly string[];
  readonly description?: string;
  readonly iconUri?: string;
  readonly version: number;
  readonly metadata: string;

  readonly contractAddress: string;
  readonly network: Network;
  readonly allowedTokens: {
    readonly tez: boolean;
    readonly assets: readonly string[];
  }

  readonly owner: string;
  readonly paused: boolean;
  readonly deleted: boolean;
}