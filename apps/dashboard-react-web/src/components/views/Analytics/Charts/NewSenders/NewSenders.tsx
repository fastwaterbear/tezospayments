import React from 'react';

import { OperationType } from '@tezospayments/common';

import { LineColor } from '../../../../../models/charts';
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
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      selectedMode: false
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    series: [{ type: 'line', color: LineColor.Blue }]
  };

  return <ChartPure className={props.className} title={title} option={option} loading={!isInitialized} />;
};

export const NewSendersPure = React.memo(NewSenders);
