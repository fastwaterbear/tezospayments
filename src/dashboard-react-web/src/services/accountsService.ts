import { ColorMode, DAppClient, NetworkType } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';

import { config } from '../config';
import { Token } from '../models/blockchain';
import { TokenFA12, TokenFA2 } from '../models/blockchain/token';

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
      const tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');
      this._tezos = tezos;
    }

    return this._tezos;
  }

  async connect(): Promise<string> {
    return new Promise<string>(resolve => {
      this.client.requestPermissions({ network: { type: NetworkType.EDONET } })
        .then(permissions => resolve(permissions.address))
        .catch(e => {
          console.error(e);
          this.client.clearActiveAccount();
        });
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
        // result = await this.getTokenFA12Balance(address, token);
        result = 356.5735238;
        break;
      case 'fa2':
        //result = await this.getTokenFA2Balance(address, token);
        result = 532345.3234324235423;
        break;
      default:
        throw new Error('Not Supported');
    }

    return result;
  }

  private async getTokenFA12Balance(address: string, token: TokenFA12): Promise<number> {
    const contract = await this.tezos.contract.at(token.contractAddress);
    const result = await contract.views.getBalance?.(address).read();

    return result || 0;
  }

  private async getTokenFA2Balance(address: string, token: TokenFA2): Promise<number> {
    const contract = await this.tezos.contract.at(token.contractAddress);
    const response = await contract.views?.['balance_of']?.([{ owner: address, token_id: token.fa2TokenId }])
      .read();

    const result = response[0].balance;

    return result || 0;
  }
}

