import { ColorMode } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

import { Network, networks } from '@tezospayments/common';
import { BetterCallDevBlockchainUrlExplorer, BetterCallDevDataProvider, ServicesProvider, TzKTDataProvider, TzStatsBlockchainUrlExplorer } from '@tezospayments/react-web-core';

import { config } from '../config';
import { LocalPaymentService } from '../services/localPaymentService';
import { AppStore } from '../store';

interface AppServices {
  readonly localPaymentService: LocalPaymentService;
  readonly betterCallDevBlockchainUrlExplorer: BetterCallDevBlockchainUrlExplorer;
  readonly tzStatsUrlBlockchainExplorer: TzStatsBlockchainUrlExplorer;
}

export class WebApp {
  readonly store: AppStore;
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
  }

  private detectNetwork(): Network {
    const networkName = new URLSearchParams(window.location.search).get('network');

    return (networkName && networks[networkName as keyof typeof networks]) || networks[config.tezos.defaultNetwork];
  }

  private createServices(): AppServices {
    const networkConfig = config.tezos.networks[this.network.name];
    const servicesProvider = this.createServicesProvider(this.network);

    return {
      localPaymentService: new LocalPaymentService({
        network: this.network,
        store: this.store,
        tezosToolkit: this.tezosToolkit,
        tezosWallet: this.tezosWallet,
        servicesProvider
      }),
      betterCallDevBlockchainUrlExplorer: new BetterCallDevBlockchainUrlExplorer(this.network, networkConfig.explorers.betterCallDev.baseUrl),
      tzStatsUrlBlockchainExplorer: new TzStatsBlockchainUrlExplorer(this.network, networkConfig.explorers.tzStats.baseUrl)
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
}
