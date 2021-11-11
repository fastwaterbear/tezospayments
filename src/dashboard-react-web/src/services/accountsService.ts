import { DAppClient } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Token, TokenFA2, TokenFA12, Network, tezosMeta } from '@tezospayments/common';
import { converters } from '@tezospayments/react-web-core';

import { Account } from '../models/blockchain';

export class AccountsService {
  constructor(
    private readonly tezosToolkit: TezosToolkit,
    private readonly dAppClient: DAppClient
  ) {
  }

  async connect(network: Network): Promise<Account | null> {
    return this.dAppClient.requestPermissions({ network: { type: converters.networkToBeaconNetwork(network) } })
      .then(permissions => {
        return {
          address: permissions.address,
          publicKey: permissions.publicKey,
          network
        };
      })
      .catch(e => {
        console.error(e);
        this.dAppClient.clearActiveAccount();
        return null;
      });
  }

  disconnect(): Promise<void> {
    return this.dAppClient.clearActiveAccount();
  }

  async getActiveAccount(): Promise<Account | undefined> {
    const activeAccount = await this.dAppClient.getActiveAccount();

    return activeAccount
      ? {
        address: activeAccount.address,
        publicKey: activeAccount.publicKey,
        network: converters.beaconNetworkToNetwork(activeAccount.network.type)
      }
      : undefined;
  }

  async getTezosBalance(account: Account): Promise<BigNumber> {
    const balance = await this.tezosToolkit.tz.getBalance(account.address);

    return balance.div(10 ** tezosMeta.decimals);
  }

  async getTokenBalance(account: Account, token: Token): Promise<BigNumber> {
    let result: BigNumber | null = null;

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

    return result.div(divider);
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
