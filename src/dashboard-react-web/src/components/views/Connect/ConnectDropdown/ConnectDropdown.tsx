import { NetworkType } from '@airgap/beacon-sdk';
import { Dropdown, Menu } from 'antd';
import React, { useCallback } from 'react';

import { config } from '../../../../config';
import { connectAccount } from '../../../../store/accounts/slice';
import { useAppDispatch, useCurrentLanguageResources } from '../../../hooks';

import './ConnectDropdown.scss';

export const ConnectDropdown = () => {
  const dispatch = useAppDispatch();
  const handleConnectButtonClick = useCallback(() => {

    dispatch(connectAccount(NetworkType.EDONET));
  }, [dispatch]);

  const handleMenuItemButtonClick = useCallback((e: { key: string }) => {
    dispatch(connectAccount(e.key as NetworkType));
  }, [dispatch]);

  const langResources = useCurrentLanguageResources();
  const connectLangResources = langResources.views.connect.actions.connect;

  const testNets = [{
    text: connectLangResources.connectToGranada,
    color: config.tezos.rpcNodes.granadanet.color,
    network: NetworkType.GRANADANET
  }];

  const connectMenuItems = testNets.map(t => <Menu.Item key={t.network}>
    <div className="connect-dropdown__item-container">
      <div className="connect-dropdown__item-icon-container">
        <div className="connect-dropdown__item-icon" style={{ backgroundColor: t.color }}></div>
      </div>
      <div className="connect-dropdown__item-text">{t.text}</div>
    </div>
  </Menu.Item>);

  const connectMenu = (
    <Menu onClick={handleMenuItemButtonClick}>
      {connectMenuItems}
    </Menu>
  );

  return <Dropdown.Button className="connect-dropdown" type="primary" onClick={handleConnectButtonClick} overlay={connectMenu}>
    {connectLangResources.connectToEdo2}
  </Dropdown.Button>;
};

export const ConnectDropdownPure = React.memo(ConnectDropdown);
