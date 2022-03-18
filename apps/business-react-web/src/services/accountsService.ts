import { DAppClient } from '@airgap/beacon-sdk';
import BigNumber from 'bignumber.js';

import { Token, Network } from '@tezospayments/common';
import { BalancesProvider, converters } from '@tezospayments/react-web-core';

import { Account } from '../models/blockchain';

export class AccountsService {
  constructor(
    private readonly dAppClient: DAppClient,
    private readonly balancesProvider: BalancesProvider
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
    return this.balancesProvider.getTezosBalance(account.address);
  }

  async getTokenBalance(account: Account, token: Token): Promise<BigNumber> {
    return this.balancesProvider.getTokenBalance(account.address, token);
  }
}
