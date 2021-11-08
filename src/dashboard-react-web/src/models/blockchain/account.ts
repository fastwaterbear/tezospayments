import { StateModel, Network } from '@tezospayments/common';

export interface Account {
  readonly address: string;
  readonly publicKey: string;
  readonly network: Network;
}

export class Account extends StateModel {
  static getShortAddress(account: Account) {
    return `${account.address.substr(0, 9)}...${account.address.substr(account.address.length - 6, 6)}`;
  }
}
