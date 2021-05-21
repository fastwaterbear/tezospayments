import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { config } from '../../config';
import { OverviewPure } from '../views';
import { HeaderPure } from './Header';
import './App.scss';

export const App = () => {
  return <React.Fragment>
    <HeaderPure />
    <Switch>
      <Route path={config.routers.overview} exact={true} component={OverviewPure} />
    </Switch>
    {/* <FooterPure /> */}
  </React.Fragment>;
};
