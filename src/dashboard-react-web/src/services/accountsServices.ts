import { ColorMode, DAppClient, NetworkType } from '@airgap/beacon-sdk';
import { TezosToolkit } from '@taquito/taquito';

import { config } from '../config';

export class AccountsService {
  private _client: DAppClient | null = null;

  private get client(): DAppClient {
    if (!this._client) {
      this._client = new DAppClient({ name: config.app.name, colorMode: ColorMode.LIGHT });
    }

    return this._client;
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
    const tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');
    const balance = await tezos.tz.getBalance(address);

    return +balance / 1000000;
  }
}
