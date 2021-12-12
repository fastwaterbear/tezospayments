import React from 'react';

import { OperationType } from '@tezospayments/common';

import { AnalyticsView, Period } from '../../../../models/system';
import { ProfitPure } from '../Charts/Profit';

interface ServicesProps {
  period: Period;
}

export const Services = (props: ServicesProps) => {
  return <div className="analytics-container">
    <ProfitPure period={props.period} view={AnalyticsView.Services} type={OperationType.Payment} />
  </div>;
};

export const ServicesPure = React.memo(Services);
