import React from 'react';

import { config } from '../config';
import './Header.scss';

export const Header = () => {
  return <header className="header">
    <span className="header__title">{config.app.name}</span>;
  </header>;
};

export const HeaderPure = React.memo(Header);
