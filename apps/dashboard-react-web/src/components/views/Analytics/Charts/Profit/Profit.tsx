import React from 'react';

import { LineColor } from '../../../../../models/charts';
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
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      selectedMode: false
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    series: [{ type: 'line', color: LineColor.Blue }]
  };

  return <ChartPure className={props.className} title={analyticsLangResources.profit} option={option} loading={!isInitialized} />;
};

export const ProfitPure = React.memo(Profit);
