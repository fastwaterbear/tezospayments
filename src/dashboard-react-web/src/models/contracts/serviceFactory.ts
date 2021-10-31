import { BigMapAbstraction } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export interface ServiceFactoryStorage {
  readonly services: BigMapAbstraction;
  readonly administrator: string;
  readonly paused: boolean;
  readonly factory_implementation: string;
  readonly factory_implementation_version: BigNumber;
}
