import React from 'react';

import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectOperationsState, selectProfitChartData } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

interface ProfitProps {
  period: Period;
  operationType: ChartOperationType;
}

export const Volume = (props: ProfitProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const dataSource = useAppSelector((state: AppState) => selectProfitChartData(state, props.operationType, props.period));

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      dimensions: [
        'day',
        { name: 'volume', displayName: analyticsLangResources.all },
        { name: 'incoming', displayName: analyticsLangResources.incoming },
        { name: 'outgoing', displayName: analyticsLangResources.outgoing }
      ],
      source: dataSource
    },
    title: {
      text: analyticsLangResources.volume,
      padding: 0,
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
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
    series: [{ type: 'line', color: '#3571E9' }, { type: 'line', color: '#879E15' }, { type: 'line', color: '#DD364F' }]
  };

  return <ChartPure option={option} loading={!isInitialized} />;
};

export const VolumePure = React.memo(Volume);
