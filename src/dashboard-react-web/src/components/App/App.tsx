import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { config } from '../../config';
import { OverviewPure, ConnectPure } from '../views';
import { HeaderPure } from './Header';
import './App.scss';

export const App = () => {
  return <React.Fragment>
    <HeaderPure />
    <Switch>
      <Route path={config.routers.overview} exact={true} component={OverviewPure} />
      <Route path={config.routers.connect} component={ConnectPure} />
    </Switch>
    {/* <FooterPure /> */}
  </React.Fragment>;
};
