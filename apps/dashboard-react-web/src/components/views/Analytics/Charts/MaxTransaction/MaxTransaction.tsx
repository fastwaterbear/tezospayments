import React from 'react';

import { OperationType } from '@tezospayments/common';

import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectMaxTransactionChartData, selectOperationsState } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

interface MaxTransactionProps {
  period: Period;
  operationType: ChartOperationType;
  className?: string;
}

export const MaxTransaction = (props: MaxTransactionProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const dataSource = useAppSelector((state: AppState) => selectMaxTransactionChartData(state, props.operationType, props.period));

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      dimensions: ['day', { name: 'max', displayName: analyticsLangResources.currency.usd }],
      source: dataSource
    },
    title: {
      text: props.operationType === OperationType.Donation ? analyticsLangResources.maximumDonation : analyticsLangResources.maximumPayment,
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

export const MaxTransactionPure = React.memo(MaxTransaction);
