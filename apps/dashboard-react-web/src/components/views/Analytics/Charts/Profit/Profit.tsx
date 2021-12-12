import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectOperationsState, selectProfitChartData } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector } from '../../../../hooks';

interface ProfitProps {
  period: Period;
  type: OperationType;
  ignoreOutgoing?: boolean;
  title: string;
}

export const Profit = (props: ProfitProps) => {
  const isInitialized = useAppSelector(selectOperationsState).initialized;

  const dataSource = useAppSelector((state: AppState) => selectProfitChartData(state, props.type, props.period, !!props.ignoreOutgoing));
  const currencyName = dataSource[0] ? dataSource[0][1].toString() : 'unknown';

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      source: dataSource
    },
    title: {
      text: props.title,
      padding: 0,
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [currencyName],
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
    series: [
      {
        name: currencyName,
        type: 'line',
      }
    ]
  };

  return <ChartPure option={option} loading={!isInitialized} />;
};

export const ProfitPure = React.memo(Profit);
