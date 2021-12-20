import React from 'react';

import { OperationType } from '@tezospayments/common';

import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectNewSendersCountChartData, selectOperationsState } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

interface NewSendersProps {
  period: Period;
  operationType: ChartOperationType;
  className?: string;
}

export const NewSenders = (props: NewSendersProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const dataSource = useAppSelector((state: AppState) => selectNewSendersCountChartData(state, props.operationType, props.period));
  const title = props.operationType === OperationType.Donation ? analyticsLangResources.newDonators : analyticsLangResources.newCustomers;

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      dimensions: ['day', { name: 'newSendersCount', displayName: title }],
      source: dataSource
    },
    title: {
      text: title,
      padding: 0,
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
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
    series: [{ type: 'line', color: '#3571E9' }]
  };

  return <ChartPure className={props.className} option={option} loading={!isInitialized} />;
};

export const NewSendersPure = React.memo(NewSenders);
