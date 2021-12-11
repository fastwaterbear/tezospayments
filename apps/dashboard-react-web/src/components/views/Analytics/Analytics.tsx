import React, { useState, useCallback } from 'react';

import { AnalyticsView, Period } from '../../../models/system';
import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { Donations } from './Donations';
import { HeaderPure } from './Header';
import { Services } from './Services';

import './Analytics.scss';

export const Analytics = () => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

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
    {view === AnalyticsView.Services ? <Services period={period} /> : <Donations period={period} />}
  </View>;
};

export const AnalyticsPure = React.memo(Analytics);
