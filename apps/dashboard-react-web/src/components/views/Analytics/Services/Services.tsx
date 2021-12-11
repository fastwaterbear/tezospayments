import React from 'react';

import { AnalyticsView, Period } from '../../../../models/system';
import { ProfitPure } from '../Charts/Profit';

interface ServicesProps {
  period: Period;
}

export const Services = (props: ServicesProps) => {
  return <div className="analytics-container">
    <ProfitPure period={props.period} view={AnalyticsView.Services} />
  </div>;
};

export const ServicesPure = React.memo(Services);
