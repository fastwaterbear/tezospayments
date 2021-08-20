import { DAppClient } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Token, TokenFA2, TokenFA12, Network } from '@tezospayments/common';

import { config } from '../config';
import { Account } from '../models/blockchain';
import { getBeaconNetworkType, getNetwork } from './utils';

export class AccountsService {
  private readonly dAppClient: DAppClient;
  private readonly tezosToolKitByNetwork: Map<Network, TezosToolkit> = new Map<Network, TezosToolkit>();

  constructor(dAppClient: DAppClient) {
    this.dAppClient = dAppClient;
  }

  async connect(network: Network): Promise<string | null> {
    return this.dAppClient.requestPermissions({ network: { type: getBeaconNetworkType(network) } })
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
      ? { address: activeAccount.address, network: getNetwork(activeAccount.network.type) }
      : undefined;
  }

  async getTezosBalance(account: Account): Promise<number> {
    const tezosToolKit = this.getTezosToolKit(account.network);
    const balance = await tezosToolKit.tz.getBalance(account.address);

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

    return result.toNumber();
  }

  private getTezosToolKit(network: Network): TezosToolkit {
    let tezosToolkit = this.tezosToolKitByNetwork.get(network);
    if (!tezosToolkit) {
      const networkConfig = config.tezos.networks[network.name];
      tezosToolkit = new TezosToolkit(networkConfig.rpcUrls[networkConfig.default.rpc]);
      tezosToolkit.setProvider({ signer: new ReadOnlySigner() });
      this.tezosToolKitByNetwork.set(network, tezosToolkit);
    }
    return tezosToolkit;
  }

  private async getTokenFA12Balance(account: Account, token: TokenFA12): Promise<BigNumber> {
    const tezosToolKit = this.getTezosToolKit(account.network);

    const contract = await tezosToolKit.contract.at(token.contractAddress);
    const result = await contract.views.getBalance?.(account.address).read();

    return result || 0;
  }

  private async getTokenFA2Balance(account: Account, token: TokenFA2): Promise<BigNumber> {
    const tezosToolKit = this.getTezosToolKit(account.network);

    const contract = await tezosToolKit.contract.at(token.contractAddress);
    const response = await contract.views?.['balance_of']?.([{ owner: account.address, token_id: token.fa2TokenId }])
      .read();

    const result = response[0].balance;

    return result || 0;
  }
}

export class ReadOnlySigner {
  async publicKeyHash() {
    return 'tz1UqarjGfmwrd1BBHsXDtvdHx8VQgqKXrcK';
  }

  async publicKey() {
    return 'edpkuAjgFnspKtJDxECF4cHeNjjWk7rxKTsWPSCFkX67sVsvxXyzYK';
  }

  async secretKey(): Promise<string> {
    throw new Error('Secret key cannot be exposed');
  }

  async sign(): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    throw new Error('Cannot sign');
  }
}
