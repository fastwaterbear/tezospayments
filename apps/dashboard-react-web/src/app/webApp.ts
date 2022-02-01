import { ColorMode } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

import { EventEmitter, Network, networks, PublicEventEmitter, ReadOnlySigner } from '@tezospayments/common';
import {
  ServicesProvider, TzKTDataProvider, BetterCallDevDataProvider,
  BlockchainUrlExplorer, TzStatsBlockchainUrlExplorer, BetterCallDevBlockchainUrlExplorer, TzKTBlockchainUrlExplorer, TezosNodeDataProvider
} from '@tezospayments/react-web-core';

import { config } from '../config';
import type { Account } from '../models/blockchain';
import { AccountsService } from '../services/accountsService';
import { ServicesService } from '../services/servicesService';
import { AppStore } from '../store';
import { selectCurrentAccount } from '../store/accounts/selectors';
import { clearBalances, loadBalances } from '../store/balances/slice';
import { clearServices, loadServices } from '../store/services/slice';
import type { ReactAppContext } from './reactAppContext';

interface AppServices {
  readonly accountsService: AccountsService;
  readonly servicesService: ServicesService;
}

export class WebApp {
  readonly store: AppStore;
  readonly tezosWallet = new BeaconWallet({ name: config.app.name, colorMode: ColorMode.LIGHT });
  readonly networkChanged: PublicEventEmitter<readonly [newNetwork: Network, previousNetwork: Network]> = new EventEmitter();

  private readonly onStoreChangedListener = this.onStoreChanged.bind(this);
  private readonly unsubscribeStoreChanged: (() => void);

  private _network: Network | undefined;
  private _tezosToolkit: TezosToolkit | undefined;
  private _services: AppServices | undefined;
  private _reactAppContext: ReactAppContext | undefined;
  private currentAccountAddress: string | null;

  constructor(storeFactory: (app: WebApp) => AppStore) {
    this.store = storeFactory(this);
    this.applyNetwork(networks[config.tezos.defaultNetwork]);

    this.currentAccountAddress = null;
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

  get reactAppContext() {
    if (!this._reactAppContext)
      throw this.getNetworkError();
    return this._reactAppContext;
  }

  protected onStoreChanged() {
    const appState = this.store.getState();
    const currentAccountFromState = selectCurrentAccount(appState);
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

  protected async fetchAccountData(account: Account) {
    await this.store.dispatch(loadServices(account));
    await this.store.dispatch(loadBalances(account));
  }

  protected async clearAccountData() {
    await Promise.all([
      this.store.dispatch(clearBalances()),
      this.store.dispatch(clearServices()),
    ]);
  }

  protected applyNetwork(network: Network) {
    this._network = network;

    const networkConfig = config.tezos.networks[this.network.name];
    this._tezosToolkit = new TezosToolkit(networkConfig.rpcUrls[networkConfig.default.rpc]);
    this.tezosToolkit.setSignerProvider(new ReadOnlySigner());
    this.tezosToolkit.setWalletProvider(this.tezosWallet);

    this._services = this.createServices();
    this._reactAppContext = this.createReactAppContext();

    (this.networkChanged as EventEmitter<readonly [newNetwork: Network, previousNetwork: Network]>).emit(this._network, network);
  }

  private createServices(): AppServices {
    const networkConfig = config.tezos.networks[this.network.name];
    const servicesProvider = this.createServicesProvider(this.network);
    const balancesProvider = new TezosNodeDataProvider(this.tezosToolkit);

    return {
      accountsService: new AccountsService(this.tezosWallet.client, balancesProvider),
      servicesService: new ServicesService(
        this.tezosToolkit,
        servicesProvider,
        networkConfig.servicesFactoryContractAddress
      )
    };
  }

  private createReactAppContext(): ReactAppContext {
    return {
      tezosWallet: this.tezosWallet,
      tezosExplorer: this.createTezosBlockchainUrlExplorer(this.network)
    };
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
