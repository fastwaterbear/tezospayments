import React from 'react';

import { tezosMeta, unknownAssetMeta } from '@tezospayments/common';

import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectOperationsCountByTokensChartData, selectOperationsState } from '../../../../../store/operations/selectors';
import { selectAllAcceptedTokens } from '../../../../../store/services/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

type ChartOptions = React.ComponentProps<typeof ChartPure>['option'];

interface OperationsCountByTokensProps {
  period: Period;
  operationType: ChartOperationType;
  className?: string;
  showZoom?: boolean;
}

export const OperationsCountByTokens = (props: OperationsCountByTokensProps) => {
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  const dataSource = useAppSelector((state: AppState) => selectOperationsCountByTokensChartData(state, props.operationType, props.period));
  const tokens = useAppSelector(selectAllAcceptedTokens);
  const tokensDimensions = tokens.map(t => ({ name: (t.metadata || unknownAssetMeta).symbol }));
  const series: NonNullable<ChartOptions['series']> = tokensDimensions.map(() => ({
    type: 'bar',
    stack: 'main-stack',
  }));

  const option: ChartOptions = {
    dataset: {
      dimensions: [
        'day',
        { name: tezosMeta.symbol },
        ...tokensDimensions
      ],
      source: dataSource
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    series
  };

  return <ChartPure className={props.className} title={analyticsLangResources.operationsCountByTokens}
    option={option} loading={!isInitialized} showZoom={props.showZoom} />;
};

export const OperationsCountByTokensPure = React.memo(OperationsCountByTokens);
