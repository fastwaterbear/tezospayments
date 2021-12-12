import React from 'react';

import { OperationType } from '@tezospayments/common';

import { AnalyticsView, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectProfitChartData } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector } from '../../../../hooks';

interface ProfitProps {
  period: Period;
  view: AnalyticsView;
  type: OperationType;
}

export const Profit = (props: ProfitProps) => {
  const dataSource = useAppSelector((state: AppState) => selectProfitChartData(state, props.type, props.period));

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      source: dataSource
    },
    title: {
      text: 'Profit',
      padding: 0,
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['USD']
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
    series: [
      {
        name: 'USD',
        type: 'line',
      }
    ]
  };

  return <ChartPure option={option} theme="light" />;
};

export const ProfitPure = React.memo(Profit);
