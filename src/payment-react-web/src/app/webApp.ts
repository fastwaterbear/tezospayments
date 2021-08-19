import { ColorMode } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';

import { Network, networks } from '@tezospayments/common';

import { config } from '../config';
import { LocalPaymentService } from '../services/localPaymentService';
import { AppStore } from '../store';
import { BetterCallDevBlockchainUrlExplorer, TzStatsBlockchainUrlExplorer } from './explorers';

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

  private createServices(): AppServices {
    const networkConfig = config.tezos.networks[this.network.name];
    return {
      localPaymentService: new LocalPaymentService({
        network: this.network,
        store: this.store,
        tezosToolkit: this.tezosToolkit,
        tezosWallet: this.tezosWallet
      }),
      betterCallDevBlockchainUrlExplorer: new BetterCallDevBlockchainUrlExplorer(this.network, networkConfig.explorers.betterCallDev.baseUrl),
      tzStatsUrlBlockchainExplorer: new TzStatsBlockchainUrlExplorer(this.network, networkConfig.explorers.tzStats.baseUrl)
    };
  }

  private detectNetwork(): Network {
    const networkName = new URLSearchParams(window.location.search).get('network');

    return (networkName && networks[networkName as keyof typeof networks]) || networks[config.tezos.defaultNetwork];
  }
}
