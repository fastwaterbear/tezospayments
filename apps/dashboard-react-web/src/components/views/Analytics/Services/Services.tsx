import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period, ProfitChartType } from '../../../../models/system';
import { useCurrentLanguageResources } from '../../../hooks';
import { OperationsCountPure } from '../Charts/OperationsCount';
import { ProfitPure } from '../Charts/Profit';

interface ServicesProps {
  period: Period;
}

export const Services = (props: ServicesProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const operationType = OperationType.Payment;

  return <div className="analytics-container">
    <ProfitPure period={props.period} operationType={operationType} chartType={ProfitChartType.Revenue} title={analyticsLangResources.revenue} />
    <ProfitPure period={props.period} operationType={operationType} chartType={ProfitChartType.Profit} title={analyticsLangResources.profit} />
    <ProfitPure period={props.period} operationType={operationType} chartType={ProfitChartType.GrossVolume} title={analyticsLangResources.grossVolume} />
    <OperationsCountPure period={props.period} operationType={operationType} title={analyticsLangResources.operationsCount} />
  </div>;
};

export const ServicesPure = React.memo(Services);
