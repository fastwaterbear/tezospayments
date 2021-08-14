import { NetworkType } from '@airgap/beacon-sdk';
import React from 'react';

import { config } from '../../../../config';

import './AccountNetworkGroup.scss';

interface AccountNetworkGroupProps {
  networkType: NetworkType;
}

export const AccountNetworkGroup = (props: AccountNetworkGroupProps) => {
  const network = config.tezos.rpcNodes[props.networkType];

  return <div className="account-network-group">
    <div className="account-network-group__icon-container">
      <div className="account-network-group__icon" style={{ backgroundColor: network.color }}></div>
    </div>
    <div>{network.name}</div>
  </div>;
};

export const AccountNetworkGroupPure = React.memo(AccountNetworkGroup);
