import { DAppClient } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Token, TokenFA2, TokenFA12, Network } from '@tezospayments/common';
import { converters } from '@tezospayments/react-web-core';

import { Account } from '../models/blockchain';

export class AccountsService {
  constructor(
    private readonly tezosToolkit: TezosToolkit,
    private readonly dAppClient: DAppClient
  ) {
  }

  async connect(network: Network): Promise<string | null> {
    return this.dAppClient.requestPermissions({ network: { type: converters.networkToBeaconNetwork(network) } })
      .then(permissions => permissions.address)
      .catch(e => {
        console.error(e);
        this.dAppClient.clearActiveAccount();
        return null;
      });
  }

  disconnect(): Promise<void> {
    return this.dAppClient.clearActiveAccount();
  }

  async getActiveAccount(): Promise<Pick<Account, 'address' | 'network'> | undefined> {
    const activeAccount = await this.dAppClient.getActiveAccount();

    return activeAccount
      ? { address: activeAccount.address, network: converters.beaconNetworkToNetwork(activeAccount.network.type) }
      : undefined;
  }

  async getTezosBalance(account: Account): Promise<number> {
    const balance = await this.tezosToolkit.tz.getBalance(account.address);

    return +balance / 1000000;
  }

  async getTokenBalance(account: Account, token: Token): Promise<number> {
    let result = null;

    switch (token.type) {
      case 'fa1.2':
        result = await this.getTokenFA12Balance(account, token);
        break;
      case 'fa2':
        result = await this.getTokenFA2Balance(account, token);
        break;
      default:
        throw new Error('Not Supported');
    }
    const divider = token.metadata ? 10 ** token.metadata.decimals : 1;

    return +result / divider;
  }

  private async getTokenFA12Balance(account: Account, token: TokenFA12): Promise<BigNumber> {
    const contract = await this.tezosToolkit.contract.at(token.contractAddress);
    const result = await contract.views.getBalance?.(account.address).read();

    return result || 0;
  }

  private async getTokenFA2Balance(account: Account, token: TokenFA2): Promise<BigNumber> {
    const contract = await this.tezosToolkit.contract.at(token.contractAddress);
    const response = await contract.views?.['balance_of']?.([{ owner: account.address, token_id: token.fa2TokenId }])
      .read();

    const result = response[0].balance;

    return result || 0;
  }
}
