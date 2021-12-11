import React from 'react';

import { AnalyticsView, Period } from '../../../../../models/system';
import { ChartPure } from '../../../../common/Chart';

interface ProfitProps {
  period: Period;
  view: AnalyticsView;
}

export const Profit = (_props: ProfitProps) => {
  const dataSource = [
    ['Commodity', 'USD'],
    ['Mon', 120],
    ['Tue', 132],
    ['Wed', 101],
    ['Thu', 134],
    ['Fri', 90],
    ['Sat', 230],
    ['Sun', 210],
  ];

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
