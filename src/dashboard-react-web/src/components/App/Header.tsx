import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { config } from '../../config';
import { Account } from '../../models/blockchain';
import { getCurrentAccount } from '../../store/accounts/selectors';
import { disconnectAccount } from '../../store/accounts/slice';
import { ButtonPure } from '../common';
import { useAppDispatch, useAppSelector } from '../hooks';
import './Header.scss';

export const Header = () => {
  const currentAccount = useAppSelector(getCurrentAccount);

  const dispatch = useAppDispatch();
  const handleDisconnectButtonClick = useCallback(() => {
    dispatch(disconnectAccount());
  }, [dispatch]);

  return <header className="header">
    <Link className="header__title" to={config.routers.overview}>{config.app.name}</Link>
    {currentAccount && <div>{Account.getShortAddress(currentAccount)}<ButtonPure onClick={handleDisconnectButtonClick}>Disconnect</ButtonPure></div>}
  </header>;
};

export const HeaderPure = React.memo(Header);
