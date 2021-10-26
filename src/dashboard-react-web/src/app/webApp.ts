import { ColorMode } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { History, createBrowserHistory } from 'history';

import { Network, networks } from '@tezospayments/common';
import {
  ServicesProvider, TzKTDataProvider, BetterCallDevDataProvider,
  BlockchainUrlExplorer, TzStatsBlockchainUrlExplorer, BetterCallDevBlockchainUrlExplorer, TzKTBlockchainUrlExplorer
} from '@tezospayments/react-web-core';

import { config } from '../config';
import { AccountsService } from '../services/accountsService';
import { ServicesService } from '../services/servicesService';
import { AppStore } from '../store';
import type { ReactAppContext } from './reactAppContext';
import { ReadOnlySigner } from './readOnlySigner';

interface AppServices {
  readonly accountsService: AccountsService;
  readonly servicesService: ServicesService;
}

export class WebApp {
  readonly store: AppStore;
  readonly reactAppContext: ReactAppContext;
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
    this.reactAppContext = this.createReactAppContext();
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

  protected createReactAppContext(): ReactAppContext {
    return {
      tezosExplorer: this.createTezosBlockchainUrlExplorer(this.network)
    };
  }

  protected applyNetwork(network: Network) {
    this._network = network;

    const networkConfig = config.tezos.networks[this.network.name];
    this._tezosToolkit = new TezosToolkit(networkConfig.rpcUrls[networkConfig.default.rpc]);
    this.tezosToolkit.setSignerProvider(new ReadOnlySigner());
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

    switch (indexerName) {
      case 'tzKT':
        return new TzKTDataProvider(network, networkConfig.indexerUrls.tzKT, networkConfig.servicesFactoryContractAddress);
      case 'betterCallDev':
        return new BetterCallDevDataProvider(network, networkConfig.indexerUrls.betterCallDev, networkConfig.servicesFactoryContractAddress);
      default:
        throw new Error('Unknown service provider');
    }
  }

  private createTezosBlockchainUrlExplorer(network: Network): BlockchainUrlExplorer {
    const networkConfig = config.tezos.networks[network.name];
    const explorerName = networkConfig.default.explorer;

    switch (explorerName) {
      case 'tzKT':
        return new TzKTBlockchainUrlExplorer(network, networkConfig.explorers.tzKT.baseUrl);
      case 'tzStats':
        return new TzStatsBlockchainUrlExplorer(network, networkConfig.explorers.tzStats.baseUrl);
      case 'betterCallDev':
        return new BetterCallDevBlockchainUrlExplorer(network, networkConfig.explorers.betterCallDev.baseUrl);
      default:
        throw new Error('Unknown blockchain explorer');
    }
  }

  private getNetworkError() {
    return new Error('Network is not defined');
  }
}
