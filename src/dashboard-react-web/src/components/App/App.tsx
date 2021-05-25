import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { config } from '../../config';
import { PrivateRouteContainer } from '../common';
import { OverviewPure, ConnectPure } from '../views';
import { HeaderPure } from './Header';
import './App.scss';

export const App = () => {
  return <React.Fragment>
    <HeaderPure />
    <Switch>
      <PrivateRouteContainer path={config.routers.overview} exact={true}>
        <OverviewPure />
      </PrivateRouteContainer>
      <Route path={config.routers.connect}>
        <ConnectPure />
      </Route>
    </Switch>
    {/* <FooterPure /> */}
  </React.Fragment>;
};
