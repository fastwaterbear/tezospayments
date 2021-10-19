import { ColorMode } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

import { Network, networks } from '@tezospayments/common';
import {
  BetterCallDevBlockchainUrlExplorer, BetterCallDevDataProvider, BlockchainUrlExplorer,
  ServicesProvider, TzKTBlockchainUrlExplorer, TzKTDataProvider, TzStatsBlockchainUrlExplorer
} from '@tezospayments/react-web-core';

import { config } from '../config';
import { LocalPaymentService } from '../services/localPaymentService';
import { AppStore } from '../store';
import { ReactAppContext } from './reactAppContext';

interface AppServices {
  readonly localPaymentService: LocalPaymentService;
}

export class WebApp {
  readonly store: AppStore;
  readonly reactAppContext: ReactAppContext;
  readonly network: Network;
  readonly services: AppServices;
  readonly tezosToolkit: TezosToolkit;
  readonly tezosWallet = new BeaconWallet({ name: config.app.name, colorMode: ColorMode.LIGHT });

  constructor(storeFactory: (app: WebApp) => AppStore) {
    this.store = storeFactory(this);
    this.network = this.detectNetwork();

    const networkConfig = config.tezos.networks[this.network.name];
    this.tezosToolkit = new TezosToolkit(networkConfig.rpcUrls[networkConfig.default.rpc]);
    this.tezosToolkit.setWalletProvider(this.tezosWallet);

    this.services = this.createServices();
    this.reactAppContext = this.createReactAppContext();
  }

  private detectNetwork(): Network {
    const networkName = new URLSearchParams(window.location.search).get('network');

    return (networkName && networks[networkName as keyof typeof networks]) || networks[config.tezos.defaultNetwork];
  }

  protected createReactAppContext(): ReactAppContext {
    return {
      tezosExplorer: this.createTezosBlockchainUrlExplorer(this.network)
    };
  }

  private createServices(): AppServices {
    const servicesProvider = this.createServicesProvider(this.network);

    return {
      localPaymentService: new LocalPaymentService({
        network: this.network,
        store: this.store,
        tezosToolkit: this.tezosToolkit,
        tezosWallet: this.tezosWallet,
        servicesProvider
      })
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
}
