import { Skeleton } from 'antd';
import { useEffect } from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

import { config } from '../../config';
import { selectAccountsState } from '../../store/accounts/selectors';
import { loadActiveAccount } from '../../store/accounts/slice';
import { PrivateRouteContainer } from '../common';
import { useAppDispatch, useAppSelector } from '../hooks';
import { OverviewPure, ConnectPure } from '../views';
import { OperationsPure } from '../views/Operations';
import { HeaderPure } from './Header';
import { NavBarPure } from './NavBar';

import 'antd/dist/antd.css';
import './App.scss';

export const App = () => {
  const initialized = useAppSelector(selectAccountsState).initialized;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadActiveAccount());
  }, [dispatch]);

  return <div className="main-container">
    <HeaderPure />
    <NavBarPure />
    {!initialized
      ? <Skeleton />
      : <Switch>
        <PrivateRouteContainer exact path={config.routers.overview} >
          <OverviewPure />
        </PrivateRouteContainer>
        <PrivateRouteContainer exact path={config.routers.operations}>
          <OperationsPure />
        </PrivateRouteContainer>
        <Route path={config.routers.connect}>
          <ConnectPure />
        </Route>
      </Switch>
    }
    {/* <FooterPure /> */}
  </div>;
};
