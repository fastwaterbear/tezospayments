import React from 'react';

import { OperationDirection } from '@tezospayments/common';

import { ChartOperationType, Period } from '../../../../../models/system';
import { AppState } from '../../../../../store';
import { selectOperationsState, selectProfitByTokensChartData, } from '../../../../../store/operations/selectors';
import { ChartPure } from '../../../../common/Chart';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

interface VolumeByTokensProps {
  period: Period;
  operationType: ChartOperationType;
  operationDirection: OperationDirection;
  className?: string;
}

export const VolumeByTokens = (props: VolumeByTokensProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const dataSource = useAppSelector((state: AppState) => selectProfitByTokensChartData(state, props.operationType, props.period, props.operationDirection));
  const title = props.operationDirection === OperationDirection.Incoming ? analyticsLangResources.incoming : analyticsLangResources.outgoing;

  const option: React.ComponentProps<typeof ChartPure>['option'] = {
    title: {
      text: `${title} (${analyticsLangResources.currency.usd})`,
      padding: 0,
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {},
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['40%', '80%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 30
          }
        },
        data: dataSource
      }
    ]
  };

  return <ChartPure className={props.className} option={option} loading={!isInitialized} />;
};

export const VolumeByTokensPure = React.memo(VolumeByTokens);
