import { Card, Skeleton } from 'antd';
import React from 'react';

import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { OperationCountChartPure } from './OperationCountChart';
import { VolumeChartPure } from './VolumeChart';
import './Overview.scss';

export const Overview = () => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const overviewLangResources = langResources.views.overview;

  return <View title={overviewLangResources.title} className="overview">
    <View.Title>{overviewLangResources.title}</View.Title>

    <div className="small-cards-container">
      <Card size="small" title={overviewLangResources.balances.title} style={{ height: 205 }}>
        <Skeleton />
      </Card>

      <Card size="small" title={`${overviewLangResources.incoming.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">All Month</a>} style={{ height: 205 }}>
        <Skeleton />
      </Card>

      <Card size="small" title={`${overviewLangResources.outgoing.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">All Month</a>} style={{ height: 205 }}>
        <Skeleton />
      </Card>
    </div>

    <div className="large-cards-container">
      <Card className="chart-card" title={`${overviewLangResources.operationCount.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">6 Months</a>}>
        <OperationCountChartPure />
      </Card>

      <Card className="chart-card" title={`${overviewLangResources.volume.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">Last 2 Years</a>}>
        <VolumeChartPure />
      </Card>
    </div>
  </View >;
};

export const OverviewPure = React.memo(Overview);
