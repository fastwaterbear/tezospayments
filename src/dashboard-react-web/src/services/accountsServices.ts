import { ColorMode, DAppClient, NetworkType } from '@airgap/beacon-sdk';

import { config } from '../config';

export class AccountsService {
  private _client: DAppClient | null = null;

  private get client(): DAppClient {
    if (!this._client) {
      this._client = new DAppClient({ name: config.app.name, colorMode: ColorMode.LIGHT });
    }

    return this._client;
  }

  async connect() {
    const permissions = await this.client.requestPermissions({ network: { type: NetworkType.EDONET } });

    return permissions.address;
  }

  disconnect() {
    return this.client.clearActiveAccount();
  }
}
