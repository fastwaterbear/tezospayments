import React from 'react';

import { tezosMeta, unknownAssetMeta } from '@tezospayments/common';

import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectOperationsCountByTokensChartData, selectOperationsState } from '../../../../../store/operations/selectors';
import { selectAllAcceptedTokens } from '../../../../../store/services/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

interface OperationsCountByTokensProps {
  period: Period;
  operationType: ChartOperationType;
  className?: string;
}

type ChartOptions = React.ComponentProps<typeof ChartPure>['option'];

export const OperationsCountByTokens = (props: OperationsCountByTokensProps) => {
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  const dataSource = useAppSelector((state: AppState) => selectOperationsCountByTokensChartData(state, props.operationType, props.period));
  const tokens = useAppSelector(selectAllAcceptedTokens);
  const tokensDimensions = tokens.map(t => ({ name: t.contractAddress, displayName: (t.metadata || unknownAssetMeta).symbol }));
  const series: ChartOptions['series'] = [];
  for (let i = 0; i <= tokensDimensions.length; i++) {
    series.push({
      type: 'bar',
      stack: 'main-stack',
    });
  }

  const option: ChartOptions = {
    dataset: {
      dimensions: [
        'day',
        { name: 'xtz', displayName: tezosMeta.symbol },
        ...tokensDimensions
      ],
      source: dataSource
    },
    title: {
      text: analyticsLangResources.operationsCountByTokens,
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
    series
  };

  return <ChartPure className={props.className} option={option} loading={!isInitialized} />;
};

export const OperationsCountByTokensPure = React.memo(OperationsCountByTokens);
