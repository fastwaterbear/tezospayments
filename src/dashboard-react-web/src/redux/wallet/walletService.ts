import { ColorMode, DAppClient, NetworkType } from '@airgap/beacon-sdk';
import packageJson from '../../../package.json';
import { store } from '../store';
import { setIsConnectedToWallet } from './walletSlice';

export class WalletService {
  private static _instance: WalletService | null;
  static get instance(): WalletService {
    if (!WalletService._instance) {
      WalletService._instance = new WalletService();
    }

    return WalletService._instance;
  }

  private _client: DAppClient | null = null;
  private get client(): DAppClient {
    if (!this._client) {
      this._client = new DAppClient({ name: packageJson.name, colorMode: ColorMode.LIGHT });
    }

    return this._client;
  }

  initialize() {
    this.updateWalletState();
  }

  disconnect() {
    this.client.clearActiveAccount();
    this.updateWalletState();
  }

  async connect() {
    const permissions = await this.client.requestPermissions({ network: { type: NetworkType.EDONET } });
    store.dispatch(setIsConnectedToWallet({
      connectionState: 'connected',
      pkh: permissions.accountInfo.address
    }));
  }

  private async updateWalletState() {
    const activeAccount = await this.client.getActiveAccount();

    store.dispatch(setIsConnectedToWallet({
      connectionState: activeAccount ? 'connected' : 'disconnected',
      pkh: activeAccount ? activeAccount.address : null
    }));
  }
}
