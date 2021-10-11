import { ColorMode } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { History, createBrowserHistory } from 'history';

import { Network, networks } from '@tezospayments/common';
import { ServicesProvider, TzKTDataProvider } from '@tezospayments/react-web-core';

import { config } from '../config';
import { AccountsService } from '../services/accountsService';
import { ServicesService } from '../services/servicesService';
import { AppStore } from '../store';

interface AppServices {
  readonly accountsService: AccountsService;
  readonly servicesService: ServicesService;
}

export class WebApp {
  readonly store: AppStore;
  readonly tezosWallet = new BeaconWallet({ name: config.app.name, colorMode: ColorMode.LIGHT });
  readonly history: History;

  private _network: Network | undefined;
  private _tezosToolkit: TezosToolkit | undefined;
  private _services: AppServices | undefined;
  private onStoreChangedListener = this.onStoreChanged.bind(this);
  private unsubscribeStoreChanged: (() => void);

  constructor(storeFactory: (app: WebApp) => AppStore) {
    this.store = storeFactory(this);
    this.history = this.createHistory();

    this.applyNetwork(networks[config.tezos.defaultNetwork]);
    this.unsubscribeStoreChanged = this.store.subscribe(this.onStoreChangedListener);
  }

  get network() {
    if (!this._network)
      throw this.getNetworkError();
    return this._network;
  }

  get tezosToolkit() {
    if (!this._tezosToolkit)
      throw this.getNetworkError();
    return this._tezosToolkit;
  }

  get services() {
    if (!this._services)
      throw this.getNetworkError();
    return this._services;
  }

  protected onStoreChanged() {
    const appState = this.store.getState();

    if (appState.accountsState.currentAccount && appState.accountsState.currentAccount.network !== this.network) {
      this.applyNetwork(appState.accountsState.currentAccount.network);
    }
  }

  protected createHistory() {
    return createBrowserHistory();
  }

  protected applyNetwork(network: Network) {
    this._network = network;

    const networkConfig = config.tezos.networks[this.network.name];
    this._tezosToolkit = new TezosToolkit(networkConfig.rpcUrls[networkConfig.default.rpc]);
    this.tezosToolkit.setWalletProvider(this.tezosWallet);

    const servicesProvider = this.createServicesProvider(this.network);
    this._services = {
      accountsService: new AccountsService(this.tezosToolkit, this.tezosWallet.client),
      servicesService: new ServicesService(this.tezosToolkit, servicesProvider, networkConfig.servicesFactoryContractAddress)
    };
  }

  private createServicesProvider(network: Network): ServicesProvider {
    const networkConfig = config.tezos.networks[network.name];
    const indexerName = networkConfig.default.indexer;

    if (indexerName === 'tzKT')
      return new TzKTDataProvider(network, networkConfig.indexerUrls.tzKT, networkConfig.servicesFactoryContractAddress);
    throw new Error('Unknown service provider');
  }

  private getNetworkError() {
    return new Error('Network is not defined');
  }
}
