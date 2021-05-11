import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { config } from '../../config';
import { MainPure } from '../views';
import { HeaderPure } from './Header';
import './App.scss';

export const App = () => {
  return <React.Fragment>
    <HeaderPure />
    <Switch>
      <Route path={config.routers.main} exact={true} component={MainPure} />
    </Switch>
    {/* <FooterPure /> */}
  </React.Fragment>;
};
