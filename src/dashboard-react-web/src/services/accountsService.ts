import { DAppClient, NetworkType } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Token, TokenFA2, TokenFA12 } from '@tezospayments/common/dist/models/blockchain';

import { config } from '../config';
import { Account } from '../models/blockchain';

export class AccountsService {
  private readonly dAppClient: DAppClient;

  constructor(dAppClient: DAppClient) {
    this.dAppClient = dAppClient;
  }

  private _tezosToolKit: TezosToolkit | null = null;

  private get tezosToolKit(): TezosToolkit {
    if (!this._tezosToolKit) {
      const tezos = new TezosToolkit(config.tezos.rpcNodes.edo2net.links[0]);
      tezos.setProvider({ signer: new ReadOnlySigner() });
      this._tezosToolKit = tezos;
    }

    return this._tezosToolKit;
  }

  async connect(networkType: NetworkType): Promise<string | null> {
    return this.dAppClient.requestPermissions({ network: { type: networkType } })
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

  async getActiveAccount(): Promise<Pick<Account, 'address' | 'networkType'> | undefined> {
    const activeAccount = await this.dAppClient.getActiveAccount();

    return activeAccount
      ? { address: activeAccount.address, networkType: activeAccount.network.type }
      : undefined;
  }

  async getTezosBalance(address: string): Promise<number> {
    const balance = await this.tezosToolKit.tz.getBalance(address);

    return +balance / 1000000;
  }

  async getTokenBalance(address: string, token: Token): Promise<number> {
    let result = null;

    switch (token.type) {
      case 'fa1.2':
        result = await this.getTokenFA12Balance(address, token);
        break;
      case 'fa2':
        result = await this.getTokenFA2Balance(address, token);
        break;
      default:
        throw new Error('Not Supported');
    }

    return result.toNumber();
  }

  private async getTokenFA12Balance(address: string, token: TokenFA12): Promise<BigNumber> {
    const contract = await this.tezosToolKit.contract.at(token.contractAddress);
    const result = await contract.views.getBalance?.(address).read();

    return result || 0;
  }

  private async getTokenFA2Balance(address: string, token: TokenFA2): Promise<BigNumber> {
    const contract = await this.tezosToolKit.contract.at(token.contractAddress);
    const response = await contract.views?.['balance_of']?.([{ owner: address, token_id: token.fa2TokenId }])
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
