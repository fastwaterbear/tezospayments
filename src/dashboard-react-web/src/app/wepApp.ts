import { ColorMode } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { History, createBrowserHistory } from 'history';

import { config } from '../config';
import { AccountsService } from '../services/accountsService';
import { ServicesService } from '../services/servicesService';
import { AppStore } from '../store';

interface AppServices {
  readonly accountsService: AccountsService;
  readonly servicesService: ServicesService;
}

export class WebApp {
  readonly services: AppServices;
  readonly history: History;

  private _store: AppStore | undefined;

  constructor() {
    this.services = this.createServices();
    this.history = this.createHistory();
  }

  get store() {
    if (!this._store)
      throw new Error('The application should be started');
    return this._store;
  }

  async start(store: AppStore) {
    this._store = store;
  }

  protected createHistory() {
    return createBrowserHistory();
  }

  private createServices(): AppServices {
    const wallet = new BeaconWallet({ name: config.app.name, colorMode: ColorMode.LIGHT });

    return {
      accountsService: new AccountsService(wallet.client),
      servicesService: new ServicesService(wallet)
    };
  }
}
