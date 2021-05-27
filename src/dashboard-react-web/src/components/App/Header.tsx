import React from 'react';
import { Link } from 'react-router-dom';

import { config } from '../../config';
import { getCurrentAccount } from '../../store/accounts/selectors';
import { useAppSelector } from '../hooks';
import { AccountDropDownPure } from './AccountDropdown';

import './Header.scss';

export const Header = () => {
  const currentAccount = useAppSelector(getCurrentAccount);

  return <header className="header">
    <Link className="header__title" to={config.routers.overview}>{config.app.name}</Link>
    {currentAccount && <AccountDropDownPure />}
  </header>;
};

export const HeaderPure = React.memo(Header);
