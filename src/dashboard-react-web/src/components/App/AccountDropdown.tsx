import { Dropdown, Button, Menu } from 'antd';
import React, { useCallback } from 'react';

import { Account } from '../../models/blockchain';
import { getCurrentAccount, selectAccountsState } from '../../store/accounts/selectors';
import { disconnectAccount } from '../../store/accounts/slice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const AccountDropDown = () => {
  const dispatch = useAppDispatch();
  const handleDisconnectButtonClick = useCallback(() => {
    dispatch(disconnectAccount());
  }, [dispatch]);

  const accounts = useAppSelector(selectAccountsState);
  const currentAccount = useAppSelector(getCurrentAccount);
  if (!currentAccount) {
    return null;
  }

  const connectedAccounts = accounts.connectedAccounts.map(a =>
    <Menu.Item key={a.address}>
      {a.address}
    </Menu.Item>
  );

  const menu = <Menu>
    {connectedAccounts}
    <Menu.Divider />
    <Menu.Item key={1}>
      Copy Address
    </Menu.Item>
    <Menu.Item key={2}>
      View on TzStats
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={3} onClick={handleDisconnectButtonClick}>
      Disconnect
    </Menu.Item>
  </Menu>;

  return <Dropdown overlay={menu} placement="bottomRight">
    <Button>{Account.getShortAddress(currentAccount)}</Button>
  </Dropdown>;
};

export const AccountDropDownPure = React.memo(AccountDropDown);
