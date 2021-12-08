import React, { useState, useCallback } from 'react';

import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { Donations } from './Donations';
import { HeaderPure } from './Header';
import { Services } from './Services';

export const Analytics = () => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  const [isServicesAnalytics, setIsServicesAnalytics] = useState(true);
  const handleServicesAnalyticsChange = useCallback((value: boolean) => {
    setIsServicesAnalytics(value);
  }, []);

  return <View title={analyticsLangResources.title} className="overview">
    <HeaderPure isServicesAnalytics={isServicesAnalytics} onServicesAnalyticsChange={handleServicesAnalyticsChange} />
    {isServicesAnalytics ? <Services /> : <Donations />}
  </View>;
};

export const AnalyticsPure = React.memo(Analytics);
