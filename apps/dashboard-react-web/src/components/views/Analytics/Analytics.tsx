import React, { useState, useCallback } from 'react';

import { Period } from '../../../models/system';
import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { Donations } from './Donations';
import { HeaderPure } from './Header';
import { Services } from './Services';

import './Analytics.scss';

export const Analytics = () => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  const [isServicesAnalytics, setIsServicesAnalytics] = useState(true);
  const handleIsServicesAnalyticsChange = useCallback((value: boolean) => {
    setIsServicesAnalytics(value);
  }, []);

  const [period, setPeriod] = useState(Period.LastWeek);
  const handlePeriodChange = useCallback((value: Period) => {
    setPeriod(value);
  }, []);


  return <View title={analyticsLangResources.title} className="overview">
    <HeaderPure isServicesAnalytics={isServicesAnalytics} onIsServicesAnalyticsChange={handleIsServicesAnalyticsChange}
      period={period} onPeriodChange={handlePeriodChange} />
    {isServicesAnalytics ? <Services /> : <Donations />}
  </View>;
};

export const AnalyticsPure = React.memo(Analytics);
