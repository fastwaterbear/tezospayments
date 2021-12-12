import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period, ProfitChartType } from '../../../../models/system';
import { useCurrentLanguageResources } from '../../../hooks';
import { ProfitPure } from '../Charts/Profit';

interface ServicesProps {
  period: Period;
}

export const Services = (props: ServicesProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  return <div className="analytics-container">
    <ProfitPure period={props.period} operationType={OperationType.Payment} chartType={ProfitChartType.Revenue} title={analyticsLangResources.revenue} />
    <ProfitPure period={props.period} operationType={OperationType.Payment} chartType={ProfitChartType.Profit} title={analyticsLangResources.profit} />
    <ProfitPure period={props.period} operationType={OperationType.Payment} chartType={ProfitChartType.GrossVolume} title={analyticsLangResources.grossVolume} />
  </div>;
};

export const ServicesPure = React.memo(Services);
