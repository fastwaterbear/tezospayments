import { blue } from '@ant-design/colors';
import { ArrowRightOutlined, CopyOutlined, LogoutOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';
import React, { useCallback } from 'react';
import './AccountDropdown.scss';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

import { config } from '../../config';
import { Account } from '../../models/blockchain';
import { getCurrentAccount, selectAccountsState } from '../../store/accounts/selectors';
import { disconnectAccount } from '../../store/accounts/slice';
import { useAppDispatch, useAppSelector, useCurrentLanguageResources } from '../hooks';

export const AccountDropDown = () => {
  const langResources = useCurrentLanguageResources();
  const actionsLangResources = langResources.views.header.accountActions;

  const accounts = useAppSelector(selectAccountsState);
  const currentAccount = useAppSelector(getCurrentAccount);

  const handleCopyAddressClick = useCallback(() => {
    navigator.clipboard.writeText(currentAccount?.address || '');
  }, [currentAccount]);

  const handleViewOnTzStatsClick = useCallback(() => {
    window.open(`${config.links.tzStats}/${currentAccount?.address}`, '_blank');
  }, [currentAccount]);

  const dispatch = useAppDispatch();
  const handleDisconnectButtonClick = useCallback(() => {
    dispatch(disconnectAccount());
  }, [dispatch]);

  if (!currentAccount) {
    return null;
  }

  const connectedAccounts = accounts.connectedAccounts.map(a =>
    <Menu.Item
      key={a.address}
      icon={<UserOutlined />}
      className={combineClassNames('account-menu-item', { 'account-menu-item_selected': a.address === currentAccount.address })}
      style={a.address !== currentAccount.address ? undefined : {
        backgroundColor: blue[0],
        color: blue.primary
      }}
    >
      {a.address}
    </Menu.Item>
  );

  const menu = <Menu>
    {connectedAccounts}
    <Menu.Divider />
    <Menu.Item key={1} icon={<CopyOutlined />} onClick={handleCopyAddressClick}>
      {actionsLangResources.copyAddress.title}
    </Menu.Item>
    <Menu.Item key={2} icon={<ArrowRightOutlined />} onClick={handleViewOnTzStatsClick}>
      {actionsLangResources.viewOnTzStats.title}
    </Menu.Item>
    <Menu.Item key={3} icon={<LoginOutlined />}>
      {`${actionsLangResources.connectAnotherAccount.title} (${langResources.common.comingSoon.toLowerCase()})`}
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={5} icon={<LogoutOutlined />} onClick={handleDisconnectButtonClick}>
      {actionsLangResources.disconnect.title}
    </Menu.Item>
  </Menu >;

  return <Dropdown overlay={menu} placement="bottomRight">
    <Button style={{ borderColor: blue.primary, color: blue.primary }} className="account-dropdown">{Account.getShortAddress(currentAccount)}</Button>
  </Dropdown >;
};

export const AccountDropDownPure = React.memo(AccountDropDown);
