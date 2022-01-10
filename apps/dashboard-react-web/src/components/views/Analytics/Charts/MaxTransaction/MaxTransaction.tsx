import React from 'react';

import { OperationType } from '@tezospayments/common';

import { LineColor } from '../../../../../models/charts';
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
  const title = props.operationType === OperationType.Donation ? analyticsLangResources.maximumDonation : analyticsLangResources.maximumPayment;

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      dimensions: ['day', { name: 'max', displayName: analyticsLangResources.currency.usd }],
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

export const MaxTransactionPure = React.memo(MaxTransaction);
