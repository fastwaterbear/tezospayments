import { Token } from './token';

export interface Service {
  readonly name: string;
  readonly acceptTezos: boolean;
  readonly tokens: Token[];
}
