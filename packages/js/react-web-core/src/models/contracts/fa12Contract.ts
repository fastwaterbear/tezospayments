import type { ContractAbstraction, ContractMethod, ContractProvider, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export type Fa12Contract<T extends ContractProvider | Wallet = ContractProvider> = ContractAbstraction<T> & {
  methods: {
    approve(address: string, amount: BigNumber): ContractMethod<T>;
  }
};
