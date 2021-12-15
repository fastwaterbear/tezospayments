import React from 'react';

import { ChartOperationType, Period } from '../../../../../models/system';
import { selectOperationsState } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector } from '../../../../hooks';

interface OperationsCountProps {
  period: Period;
  operationType: ChartOperationType;
  title: string;
}

type ChartOptions = React.ComponentProps<typeof ChartPure>['option'];

export const OperationsCount = (props: OperationsCountProps) => {
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  // const dataSource = useAppSelector((state: AppState) => selectOperationsCountChartData(state, props.operationType, props.period));
  const dataSource = [{ a: 1 }];

  const option: ChartOptions = {
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
    legend: {},
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
    series: [{
      type: 'bar',
      stack: 'main-stack',
    }]
  };

  return <ChartPure option={option} loading={!isInitialized} />;
};

export const OperationsCountPure = React.memo(OperationsCount);
