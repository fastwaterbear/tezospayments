import React, { useState, useCallback } from 'react';

import { AnalyticsView, Period } from '../../../models/system';
import { selectServicesState } from '../../../store/services/selectors';
import { NoServicesCreatedPure } from '../../common/NoServicesCreated';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { DonationsPure } from './Donations';
import { HeaderPure } from './Header';
import { ServicesPure } from './Services';

import './Analytics.scss';

export const Analytics = () => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const servicesState = useAppSelector(selectServicesState);

  const [view, setView] = useState(AnalyticsView.Services);
  const handleViewChange = useCallback((value: AnalyticsView) => {
    setView(value);
  }, []);

  const [period, setPeriod] = useState(Period.LastWeek);
  const handlePeriodChange = useCallback((value: Period) => {
    setPeriod(value);
  }, []);

  return <View title={analyticsLangResources.title} className="overview">
    <HeaderPure view={view} onViewChange={handleViewChange} period={period} onPeriodChange={handlePeriodChange} />
    {servicesState.initialized && !servicesState.services.length
      ? <NoServicesCreatedPure />
      : view === AnalyticsView.Services
        ? <ServicesPure period={period} />
        : <DonationsPure period={period} />}
  </View>;
};

export const AnalyticsPure = React.memo(Analytics);
