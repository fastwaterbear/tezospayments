import React from 'react';

import { ChartPure } from '../../../common/Chart';

export const Services = () => {
  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      source: [
        ['Commodity', 'Owned', 'Financed'],
        ['Commodity 1', 4, 1],
        ['Commodity 2', 2, 4],
        ['Commodity 3', 3, 6],
        ['Commodity 4', 5, 3],
      ],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Owned', 'Financed'],
    },
    grid: {
      left: '10%',
      right: '0%',
      top: '20%',
      bottom: '20%',
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
    },
    series: [
      {
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
      },
      {
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
      },
    ],
  };

  return <div>
    <h2>Services</h2>
    <ChartPure option={option} />
  </div>;
};

export const ServicesPure = React.memo(Services);
