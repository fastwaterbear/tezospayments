import type { ContractAbstraction, ContractMethod, ContractProvider, Wallet } from '@taquito/taquito';

export interface Fa20UpdateOperatorParams {
  owner: string;
  operator: string;
  token_id: number;
}

export interface Fa20AddOperatorParams {
  add_operator: Fa20UpdateOperatorParams;
}

export interface Fa20RemoveOperatorParams {
  remove_operator: Fa20UpdateOperatorParams;
}

export type Fa20UpdateOperatorsPayload = Array<Fa20AddOperatorParams | Fa20RemoveOperatorParams>;

export type Fa20Contract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methods: {
    update_operators(payload: Fa20UpdateOperatorsPayload): ContractMethod<T>;
  }
};
