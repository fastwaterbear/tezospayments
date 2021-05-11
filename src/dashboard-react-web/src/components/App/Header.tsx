import React from 'react';
import { Link } from 'react-router-dom';

import { config } from '../../config';

import './Header.scss';

export const Header = () => {
  return <header className="header">
    <Link className="header__title" to={config.routers.main}>{config.app.name}</Link>;
    </header>;
};

export const HeaderPure = React.memo(Header);
