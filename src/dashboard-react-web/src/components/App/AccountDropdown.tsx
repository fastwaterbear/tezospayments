import { Dropdown, Button, Menu } from 'antd';
import React, { useCallback } from 'react';

import { Account } from '../../models/blockchain';
import { getCurrentAccount } from '../../store/accounts/selectors';
import { disconnectAccount } from '../../store/accounts/slice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const AccountDropDown = () => {
  const dispatch = useAppDispatch();
  const handleDisconnectButtonClick = useCallback(() => {
    dispatch(disconnectAccount());
  }, [dispatch]);

  const currentAccount = useAppSelector(getCurrentAccount);
  if (!currentAccount) {
    return null;
  }

  const menu = <Menu>
    <Menu.Item key={1}>
      {currentAccount.address}
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={2}>
      Copy Address
    </Menu.Item>
    <Menu.Item key={3}>
      View on TzStats
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key={4} onClick={handleDisconnectButtonClick}>
      Disconnect
    </Menu.Item>
  </Menu>;

  return <Dropdown overlay={menu} placement="bottomRight">
    <Button>{Account.getShortAddress(currentAccount)}</Button>
  </Dropdown>;
};

export const AccountDropDownPure = React.memo(AccountDropDown);
