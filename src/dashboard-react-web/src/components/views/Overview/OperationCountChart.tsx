import { Column } from '@ant-design/charts';
import { ColumnConfig } from '@ant-design/charts/es/column';
import React from 'react';

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

  const config: ColumnConfig = {
    data,
    xField: 'month',
    yField: 'operationCount',
    height: 400,
    meta: {
      operationCount: { alias: 'Operation count' },
    },
  };

  return <Column {...config} />;
};

export const OperationCountChartPure = React.memo(OperationCountChart);
