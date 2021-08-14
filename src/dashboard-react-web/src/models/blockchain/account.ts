import { Network } from '@tezospayments/common/dist/models/blockchain';
import { StateModel } from '@tezospayments/common/dist/models/core';

export interface Account {
  readonly address: string;
  readonly network: Network;
}

export class Account extends StateModel {
  static getShortAddress(account: Account) {
    return `${account.address.substr(0, 9)}...${account.address.substr(account.address.length - 6, 6)}`;
  }
}
