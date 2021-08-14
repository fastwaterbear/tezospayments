import { NetworkType } from '@airgap/beacon-sdk';
import React from 'react';

import { config } from '../../../../config';

import './AccountNetworkGroup.scss';

interface AccountNetworkGroupProps {
  networkType: NetworkType;
}

const getNetworkConfig = (networkType: NetworkType) => {
  switch (networkType) {
    case NetworkType.MAINNET:
      return config.tezos.rpcNodes.mainnet;
    case NetworkType.EDONET:
      return config.tezos.rpcNodes.edo2net;
    case NetworkType.FLORENCENET:
      return config.tezos.rpcNodes.florence;
    case NetworkType.GRANADANET:
      return config.tezos.rpcNodes.granadanet;

    default:
      throw new Error('Not Supported network type');
  }
};

export const AccountNetworkGroup = (props: AccountNetworkGroupProps) => {
  const network = getNetworkConfig(props.networkType);

  return <div className="account-network-group">
    <div className="account-network-group__icon-container">
      <div className="account-network-group__icon" style={{ backgroundColor: network.color }}></div>
    </div>
    <div>{network.name}</div>
  </div>;
};

export const AccountNetworkGroupPure = React.memo(AccountNetworkGroup);
