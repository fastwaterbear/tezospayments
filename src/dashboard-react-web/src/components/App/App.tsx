import React, { useEffect } from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { config } from '../../config';
import { loadActiveAccount } from '../../store/accounts/slice';
import { PrivateRouteContainer } from '../common';
import { useAppDispatch } from '../hooks';
import { OverviewPure, ConnectPure } from '../views';
import { HeaderPure } from './Header';
import 'antd/dist/antd.css';
import './App.scss';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadActiveAccount());
  }, [dispatch]);

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
