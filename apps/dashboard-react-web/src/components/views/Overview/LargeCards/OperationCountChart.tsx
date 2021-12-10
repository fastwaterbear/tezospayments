import { Column } from '@ant-design/charts';
import { Skeleton } from 'antd';
import React from 'react';

import { selectServicesState } from '../../../../store/services/selectors';
import { useAppSelector } from '../../../hooks';

export const OperationCountChart = () => {
  const data = [
    {
      month: 'May',
      operationCount: 900,
    },
    {
      month: 'June',
      operationCount: 1600,
    },
    {
      month: 'July',
      operationCount: 600,
    },
    {
      month: 'August',
      operationCount: 2200,
    },
    {
      month: 'September',
      operationCount: 950,
    },
    {
      month: 'October',
      operationCount: 1100,
    },
  ];

  const config: React.ComponentProps<typeof Column> = {
    data,
    xField: 'month',
    yField: 'operationCount',
    height: 400,
    meta: {
      operationCount: { alias: 'Operation count' },
    },
  };

  const services = useAppSelector(selectServicesState);

  if (!services.initialized) {
    return <Skeleton active paragraph={{ rows: 12 }} />;
  }

  return <Column {...config} />;
};

export const OperationCountChartPure = React.memo(OperationCountChart);
