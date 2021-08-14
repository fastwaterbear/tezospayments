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

    dispatch(connectAccount(NetworkType.MAINNET));
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
  }, {
    text: connectLangResources.connectToFlorence,
    color: config.tezos.rpcNodes.florence.color,
    network: NetworkType.FLORENCENET
  }, {
    text: connectLangResources.connectToEdo2,
    color: config.tezos.rpcNodes.edo2net.color,
    network: NetworkType.EDONET
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
    {connectLangResources.connectToMainnet}
  </Dropdown.Button>;
};

export const ConnectDropdownPure = React.memo(ConnectDropdown);
