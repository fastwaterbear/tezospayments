import { NetworkType } from '@airgap/beacon-sdk';

import { Network, networks } from '@tezospayments/common';

// TODO: move to the application-core package
export const getBeaconNetworkType: (network: Network) => NetworkType = network => {
  switch (network) {
    case networks.granadanet:
      return NetworkType.GRANADANET;
    case networks.edo2net:
      return NetworkType.EDONET;

    default:
      throw new Error('Not Supported network type');
  }
};