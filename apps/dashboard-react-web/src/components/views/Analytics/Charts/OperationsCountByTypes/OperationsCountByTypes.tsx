import React from 'react';

import { LineColor } from '../../../../../models/charts';
import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectOperationsCountByTypesChartData, selectOperationsState } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

interface OperationsCountByTypesProps {
  period: Period;
  operationType: ChartOperationType;
  className?: string;
}

type ChartOptions = React.ComponentProps<typeof ChartPure>['option'];

export const OperationsCountByTypes = (props: OperationsCountByTypesProps) => {
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  const dataSource = useAppSelector((state: AppState) => selectOperationsCountByTypesChartData(state, props.operationType, props.period));

  const option: ChartOptions = {
    dataset: {
      dimensions: [
        'day',
        { name: 'incoming', displayName: analyticsLangResources.success },
        { name: 'outgoing', displayName: analyticsLangResources.refund },
        { name: 'failed', displayName: analyticsLangResources.failed },
      ],
      source: dataSource
    },
    title: {
      text: analyticsLangResources.operationsCountByTypes,
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
    series: [
      {
        type: 'bar',
        color: LineColor.Green,
        stack: 'main-stack',
      },
      {
        type: 'bar',
        color: LineColor.Yellow,
        stack: 'main-stack',
      },
      {
        type: 'bar',
        color: LineColor.Red,
        stack: 'main-stack',
      }
    ]
  };

  return <ChartPure className={props.className} option={option} loading={!isInitialized} />;
};

export const OperationsCountByTypesPure = React.memo(OperationsCountByTypes);
