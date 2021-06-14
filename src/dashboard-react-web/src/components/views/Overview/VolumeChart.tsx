import { Line } from '@ant-design/charts';
import { LineConfig } from '@ant-design/charts/es/line';
import { Skeleton } from 'antd';
import React from 'react';

import { selectServicesState } from '../../../store/services/selectors';
import { useAppSelector } from '../../hooks';

export const VolumeChart = () => {
  const data = [
    {
      quarter: 'Q1 2020',
      sum: 24756,
    },
    {
      quarter: 'Q2 2020',
      sum: 22178,
    },
    {
      quarter: 'Q3 2020',
      sum: 13613,
    },
    {
      quarter: 'Q4 2020',
      sum: 29436,
    },
    {
      quarter: 'Q1 2021',
      sum: 25679,
    },
    {
      quarter: 'Q2 2021',
      sum: 26483,
    },
    {
      quarter: 'Q3 2021',
      sum: 41835,
    },
    {
      quarter: 'Q4 2021',
      sum: 32412,
    },
  ];

  const config: LineConfig = {
    data,
    xField: 'quarter',
    yField: 'sum',
    height: 400,
    smooth: true,
    meta: {
      sum: { alias: 'Sum' },
    },
  };

  const services = useAppSelector(selectServicesState);

  if (!services.initialized) {
    return <Skeleton active paragraph={{ rows: 12 }} />;
  }

  return <Line {...config} />;
};

export const VolumeChartPure = React.memo(VolumeChart);
