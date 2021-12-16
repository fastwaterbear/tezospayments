import React from 'react';

import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectOperationsState, selectProfitChartData } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

interface ProfitProps {
  period: Period;
  operationType: ChartOperationType;
  className?: string;
}

export const Profit = (props: ProfitProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const dataSource = useAppSelector((state: AppState) => selectProfitChartData(state, props.operationType, props.period));

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      dimensions: ['day', { name: 'profit', displayName: analyticsLangResources.currency.usd }],
      source: dataSource
    },
    title: {
      text: analyticsLangResources.profit,
      padding: 0,
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      selectedMode: false
    },
    grid: {
      top: 60,
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    series: [{ type: 'line', color: '#3571E9' }]
  };

  return <ChartPure className={props.className} option={option} loading={!isInitialized} />;
};

export const ProfitPure = React.memo(Profit);
