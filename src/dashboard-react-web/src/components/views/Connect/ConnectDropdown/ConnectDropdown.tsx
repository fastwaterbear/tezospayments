import { Dropdown, Menu } from 'antd';
import React, { useCallback } from 'react';

import { config } from '../../../../config';
import { connectAccount } from '../../../../store/accounts/slice';
import { useAppDispatch, useCurrentLanguageResources } from '../../../hooks';

import './ConnectDropdown.scss';

export const ConnectDropdown = () => {
  const dispatch = useAppDispatch();
  const handleConnectButtonClick = useCallback(() => {
    dispatch(connectAccount());
  }, [dispatch]);

  const langResources = useCurrentLanguageResources();
  const connectLangResources = langResources.views.connect.actions.connect;

  const testNets = [
    [connectLangResources.connectToGranada, config.tezos.rpcNodes.granadanet.color],
    [connectLangResources.connectToFlorence, config.tezos.rpcNodes.florence.color],
    [connectLangResources.connectToEdo2, config.tezos.rpcNodes.edo2net.color]
  ];

  const connectMenuItems = testNets.map(t => <Menu.Item key={t[0]}>
    <div className="connect-dropdown__item-container">
      <div className="connect-dropdown__item-icon-container">
        <div className="connect-dropdown__item-icon" style={{ backgroundColor: t[1] }}></div>
      </div>
      <div className="connect-dropdown__item-text">{t[0]}</div>
    </div>
  </Menu.Item>);

  const connectMenu = (
    <Menu onClick={handleConnectButtonClick}>
      {connectMenuItems}
    </Menu>
  );

  return <Dropdown.Button className="connect-dropdown" type="primary" onClick={handleConnectButtonClick} overlay={connectMenu}>
    {connectLangResources.connectToMainnet}
  </Dropdown.Button>;
};

export const ConnectDropdownPure = React.memo(ConnectDropdown);
