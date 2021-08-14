import React from 'react';

import { Network } from '@tezospayments/common/dist/models/blockchain';

import { config } from '../../../../config';

import './AccountNetworkGroup.scss';

interface AccountNetworkGroupProps {
  network: Network;
}

export const AccountNetworkGroup = (props: AccountNetworkGroupProps) => {
  const network = config.tezos.networks[props.network.name];

  return <div className="account-network-group">
    <div className="account-network-group__icon-container">
      <div className="account-network-group__icon" style={{ backgroundColor: network.color }}></div>
    </div>
    <div>{network.name}</div>
  </div>;
};

export const AccountNetworkGroupPure = React.memo(AccountNetworkGroup);
