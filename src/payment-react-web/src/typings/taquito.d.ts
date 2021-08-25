import { ContractProvider, Wallet, TransactionWalletOperation, TransactionOperation } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

interface SendParams {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
  amount: number | BigNumber;
  source?: string;
  mutez?: boolean;
}

declare module '@taquito/taquito' {
  interface ContractMethod<T extends ContractProvider | Wallet> {
    send(params?: SendParameters): Promise<T extends Wallet ? TransactionWalletOperation : TransactionOperation>;
  }
}
