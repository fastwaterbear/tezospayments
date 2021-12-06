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
import type { Account } from '../models/blockchain';
import { AccountsService } from '../services/accountsService';
import { ServicesService } from '../services/servicesService';
import { AppStore } from '../store';
import { getCurrentAccount } from '../store/accounts/selectors';
import { clearBalances, loadBalances } from '../store/balances/slice';
import { clearServices, loadServices } from '../store/services/slice';
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
  private currentAccountAddress: string | null;
  private onStoreChangedListener = this.onStoreChanged.bind(this);
  private unsubscribeStoreChanged: (() => void);

  constructor(storeFactory: (app: WebApp) => AppStore) {
    this.store = storeFactory(this);
    this.history = this.createHistory();
    this.applyNetwork(networks[config.tezos.defaultNetwork]);

    this.currentAccountAddress = null;
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
    const currentAccountFromState = getCurrentAccount(appState);
    const currentAccountAddressFromState = currentAccountFromState && currentAccountFromState.address;

    if (currentAccountAddressFromState !== this.currentAccountAddress) {
      this.currentAccountAddress = currentAccountAddressFromState;
      this.clearAccountData();

      if (currentAccountFromState) {
        if (currentAccountFromState.network !== this.network)
          this.applyNetwork(currentAccountFromState.network);

        this.fetchAccountData(currentAccountFromState);
      }
    }
  }

  protected createHistory() {
    return createBrowserHistory();
  }

  protected createReactAppContext(): ReactAppContext {
    return {
      tezosWallet: this.tezosWallet,
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
      servicesService: new ServicesService(
        this.tezosToolkit,
        servicesProvider,
        networkConfig.servicesFactoryContractAddress
      )
    };
  }

  protected async fetchAccountData(account: Account) {
    await Promise.all([
      this.store.dispatch(loadBalances(account)),
      this.store.dispatch(loadServices(account)),
    ]);
  }

  protected async clearAccountData() {
    await Promise.all([
      this.store.dispatch(clearBalances()),
      this.store.dispatch(clearServices()),
    ]);
  }

  private createServicesProvider(network: Network): ServicesProvider {
    const networkConfig = config.tezos.networks[network.name];
    const indexerName = networkConfig.default.indexer;

    switch (indexerName) {
      case 'tzKT':
        return new TzKTDataProvider(network, networkConfig.indexerUrls.tzKT, networkConfig.servicesFactoryContractAddress, networkConfig.minimumSupportedServiceVersion);
      case 'betterCallDev':
        return new BetterCallDevDataProvider(network, networkConfig.indexerUrls.betterCallDev, networkConfig.servicesFactoryContractAddress, networkConfig.minimumSupportedServiceVersion);
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
