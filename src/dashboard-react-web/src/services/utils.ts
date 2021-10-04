import { NetworkType } from '@airgap/beacon-sdk';

import { Network, networks } from '@tezospayments/common';

// TODO: move to the application-core package
export const getNetwork: (networkType: NetworkType) => Network = networkType => {
  switch (networkType) {
    case NetworkType.GRANADANET:
      return networks.granadanet;

    default:
      throw new Error('Not Supported network type');
  }
};

export const getBeaconNetworkType: (network: Network) => NetworkType = network => {
  switch (network) {
    case networks.granadanet:
      return NetworkType.GRANADANET;

    default:
      throw new Error('Not Supported network type');
  }
};
