import { History, createBrowserHistory } from 'history';

import { AccountsService } from '../services/accountsServices';
import { AppStore } from '../store';

interface AppServices {
  readonly accountsService: AccountsService;
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
    return {
      accountsService: new AccountsService()
    };
  }
}
