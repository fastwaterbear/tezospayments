import { DAppClient } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Token, Network, balance } from '@tezospayments/common';
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
    return balance.getTezosBalance(account.address, this.tezosToolkit);
  }

  async getTokenBalance(account: Account, token: Token): Promise<BigNumber> {
    return balance.getTokenBalance(account.address, token, this.tezosToolkit);
  }
}
