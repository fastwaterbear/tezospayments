import { NetworkType } from '@airgap/beacon-sdk';

import { Network, networks } from '@tezospayments/common/dist/models/blockchain';

export const getNetwork: (networkType: NetworkType) => Network = networkType => {
  switch (networkType) {
    case NetworkType.MAINNET:
      return networks.main;
    case NetworkType.GRANADANET:
      return networks.granadanet;
    case NetworkType.FLORENCENET:
      return networks.florence;
    case NetworkType.EDONET:
      return networks.edo2net;

    default:
      throw new Error('Not Supported network type');
  }
};

export const getBeaconNetworkType: (network: Network) => NetworkType = network => {
  switch (network) {
    case networks.main:
      return NetworkType.MAINNET;
    case networks.granadanet:
      return NetworkType.GRANADANET;
    case networks.florence:
      return NetworkType.FLORENCENET;
    case networks.edo2net:
      return NetworkType.EDONET;

    default:
      throw new Error('Not Supported network type');
  }
};
