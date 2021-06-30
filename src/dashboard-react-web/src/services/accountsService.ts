import { ColorMode, DAppClient, NetworkType } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { Token, TokenFA2, TokenFA12 } from '@tezos-payments/common/dist/models/blockchain';

import { config } from '../config';

export class AccountsService {
  private _client: DAppClient | null = null;

  private get client(): DAppClient {
    if (!this._client) {
      this._client = new DAppClient({ name: config.app.name, colorMode: ColorMode.LIGHT });
    }

    return this._client;
  }

  private _tezos: TezosToolkit | null = null;

  private get tezos(): TezosToolkit {
    if (!this._tezos) {
      const tezos = new TezosToolkit('https://edonet.smartpy.io/');
      tezos.setProvider({ signer: new ReadOnlySigner() });
      this._tezos = tezos;
    }

    return this._tezos;
  }

  async connect(): Promise<string | null> {
    return this.client.requestPermissions({ network: { type: NetworkType.EDONET } })
      .then(permissions => permissions.address)
      .catch(e => {
        console.error(e);
        this.client.clearActiveAccount();
        return null;
      });
  }

  disconnect(): Promise<void> {
    return this.client.clearActiveAccount();
  }

  async getActiveAccount(): Promise<string | undefined> {
    const activeAccount = await this.client.getActiveAccount();

    return activeAccount?.address;
  }

  async getTezosBalance(address: string): Promise<number> {
    const balance = await this.tezos.tz.getBalance(address);

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
    const contract = await this.tezos.contract.at(token.contractAddress);
    const result = await contract.views.getBalance?.(address).read();

    return result || 0;
  }

  private async getTokenFA2Balance(address: string, token: TokenFA2): Promise<BigNumber> {
    const contract = await this.tezos.contract.at(token.contractAddress);
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
