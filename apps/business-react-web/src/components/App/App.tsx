import { Skeleton } from 'antd';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { config } from '../../config';
import { selectAccountsState } from '../../store/accounts/selectors';
import { loadActiveAccount } from '../../store/accounts/slice';
import { RequireConnectionContainer } from '../common';
import { useAppDispatch, useAppSelector } from '../hooks';
import { OverviewPure, ConnectPure, OperationsPure, ServicePure, ServicesPure, AboutPure } from '../views';
import { AcceptPaymentsPure } from '../views/AcceptPayments';
import { AnalyticsPure } from '../views/Analytics';
import { ServiceViewMode } from '../views/Service/Service';
import { HeaderPure } from './Header';
import { NavBarPure } from './NavBar';
import { NotificationsPure } from './Notifications';

import 'antd/dist/antd.css';
import './App.scss';

const acceptServicePaymentsNestedPath = config.routers.acceptServicePayments.template.substring(
  config.routers.acceptServicePayments.template.indexOf(config.routers.acceptPayments)
);

export const App = () => {
  const initialized = useAppSelector(selectAccountsState).initialized;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadActiveAccount());
  }, [dispatch]);

  return <div className="main-container">
    <NotificationsPure />
    <HeaderPure />
    <NavBarPure />
    {!initialized
      ? <Skeleton />
      : <Routes>
        {/* Private Routes */}
        <Route path={config.routers.overview}
          element={<RequireConnectionContainer>
            <OverviewPure />
          </RequireConnectionContainer>}
        />
        <Route path={config.routers.analytics}
          element={<RequireConnectionContainer>
            <AnalyticsPure />
          </RequireConnectionContainer>}
        />
        <Route path={config.routers.operations}
          element={<RequireConnectionContainer>
            <OperationsPure />
          </RequireConnectionContainer>}
        />
        <Route path={config.routers.createService}
          element={<RequireConnectionContainer>
            <ServicePure mode={ServiceViewMode.Create} />
          </RequireConnectionContainer>}
        />
        <Route path={config.routers.service.template}
          element={<RequireConnectionContainer>
            <ServicePure mode={ServiceViewMode.ViewAndEdit} />
          </RequireConnectionContainer>}
        />
        <Route path={config.routers.services}
          element={<RequireConnectionContainer>
            <ServicesPure />
          </RequireConnectionContainer>}
        />
        <Route path={config.routers.acceptPayments}>
          <Route path=""
            element={<RequireConnectionContainer>
              <AcceptPaymentsPure />
            </RequireConnectionContainer>}
          />
          <Route path={acceptServicePaymentsNestedPath}
            element={<RequireConnectionContainer>
              <AcceptPaymentsPure />
            </RequireConnectionContainer>}
          />
        </Route>
        {/* Public Routes */}
        <Route path={config.routers.about} element={<AboutPure />} />
        <Route path={config.routers.connect} element={<ConnectPure />} />
      </Routes>
    }
    {/* <FooterPure /> */}
  </div>;
};
