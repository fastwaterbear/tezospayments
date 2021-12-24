import React from 'react';

import { LineColor } from '../../../../../models/charts';
import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectOperationsState, selectProfitChartData } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

interface ProfitProps {
  period: Period;
  operationType: ChartOperationType;
  className?: string;
  showZoom?: boolean;
}

export const Volume = (props: ProfitProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const dataSource = useAppSelector((state: AppState) => selectProfitChartData(state, props.operationType, props.period));
  const title = `${analyticsLangResources.volume} (${analyticsLangResources.currency.usd})`;

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    dataset: {
      dimensions: [
        'day',
        { name: 'volume', displayName: analyticsLangResources.all },
        { name: 'incoming', displayName: analyticsLangResources.incoming },
        { name: 'outgoing', displayName: analyticsLangResources.outgoing }
      ],
      source: dataSource
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {},
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value'
    },
    series: [{ type: 'line', color: LineColor.Blue, }, { type: 'line', color: LineColor.Green }, { type: 'line', color: LineColor.Red }]
  };

  return <ChartPure className={props.className} option={option} title={title} loading={!isInitialized} showZoom={props.showZoom} />;
};

export const VolumePure = React.memo(Volume);
