import React from 'react';
import { Link } from 'react-router-dom';

import { config } from '../../config';
import { useAppSelector } from '../../redux/hooks';
import { selectWalletState } from '../../redux/wallet/walletSlice';
import './Header.scss';

export const Header = () => {
  const { connectionState } = useAppSelector(selectWalletState);

  return <header className="header">
    <Link className="header__title" to={config.routers.overview}>{config.app.name}</Link>
    {connectionState}
  </header>;
};

export const HeaderPure = React.memo(Header);
