import { Card } from 'antd';
import React from 'react';

import { selectServicesState } from '../../../store/services/selectors';
import { NoServicesCreatedPure } from '../../common/NoServicesCreated';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { OperationCountChartPure, VolumeChartPure } from './LargeCards';
import { BalancesPure, IncomingPure, OutgoingPure } from './SmallCards';
import './Overview.scss';

export const Overview = () => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const overviewLangResources = langResources.views.overview;

  const servicesState = useAppSelector(selectServicesState);

  return <View title={overviewLangResources.title} className="overview">
    <View.Title>{overviewLangResources.title}</View.Title>

    {servicesState.initialized && !servicesState.services.length
      ? <NoServicesCreatedPure />
      : <div className="cards-container">
        <Card className="cards-container__small-card" size="small" title={overviewLangResources.balances.title} style={{ height: 220 }}>
          <BalancesPure />
        </Card>

        {/*eslint-disable-next-line max-len*/}
        <Card className="cards-container__small-card" size="small" title={`${overviewLangResources.incoming.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">All Month</a>} style={{ height: 220 }}>
          <IncomingPure />
        </Card>

        {/*eslint-disable-next-line max-len*/}
        <Card className="cards-container__small-card" size="small" title={`${overviewLangResources.outgoing.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">All Month</a>} style={{ height: 220 }}>
          <OutgoingPure />
        </Card>

        <Card className="cards-container__large-card" title={`${overviewLangResources.operationCount.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">6 Months</a>}>
          <OperationCountChartPure />
        </Card>

        <Card className="cards-container__large-card" title={`${overviewLangResources.volume.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">Last 2 Years</a>}>
          <VolumeChartPure />
        </Card>
      </div>}
  </View >;
};

export const OverviewPure = React.memo(Overview);
