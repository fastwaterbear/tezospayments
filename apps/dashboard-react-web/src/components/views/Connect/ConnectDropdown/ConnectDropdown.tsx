import { Button, Dropdown, Menu } from 'antd';
import React, { useCallback } from 'react';

import { Network, networks, networksCollection } from '@tezospayments/common';

import { config } from '../../../../config';
import { connectAccount } from '../../../../store/accounts/slice';
import { useAppDispatch, useCurrentLanguageResources } from '../../../hooks';

import './ConnectDropdown.scss';

export const ConnectDropdown = () => {
  const dispatch = useAppDispatch();
  const handleConnectButtonClick = useCallback(() => {
    dispatch(connectAccount(networks.hangzhounet));
  }, [dispatch]);

  const handleMenuItemButtonClick = useCallback((e: { key: string }) => {
    const selectedNetwork = networksCollection.find(n => n.id === e.key);
    if (selectedNetwork) {
      dispatch(connectAccount(selectedNetwork));
    }
  }, [dispatch]);

  const langResources = useCurrentLanguageResources();
  const connectLangResources = langResources.views.connect.actions.connect;

  const networkTypes: Network[] = [];
  const connectMenuItems = networkTypes.map(t => {
    const network = config.tezos.networks[t.name];

    return <Menu.Item key={t.id}>
      <div className="connect-dropdown__item-container">
        <div className="connect-dropdown__item-icon-container">
          <div className="connect-dropdown__item-icon" style={{ backgroundColor: network.color }}></div>
        </div>
        <div className="connect-dropdown__item-text">{`${connectLangResources.connectTo} ${network.title}`}</div>
      </div>
    </Menu.Item>;
  });

  const connectMenu = (
    <Menu onClick={handleMenuItemButtonClick}>
      {connectMenuItems}
    </Menu>
  );

  const connectButtonTitle = `${connectLangResources.connectTo} ${config.tezos.networks.hangzhounet.title}`;

  return connectMenuItems.length
    ? <Dropdown.Button className="connect-dropdown" type="primary" onClick={handleConnectButtonClick} overlay={connectMenu}>
      {connectButtonTitle}
    </Dropdown.Button>
    : <Button type="primary" onClick={handleConnectButtonClick}>{connectButtonTitle}</Button>;
};

export const ConnectDropdownPure = React.memo(ConnectDropdown);
