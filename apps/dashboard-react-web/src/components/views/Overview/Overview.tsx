import { Card } from 'antd';
import React from 'react';

import { Period } from '../../../models/system';
import { selectServicesState } from '../../../store/services/selectors';
import { NoServicesCreatedPure } from '../../common/NoServicesCreated';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { OperationsCountPure } from '../Analytics/Charts/OperationsCount';
import { VolumePure } from '../Analytics/Charts/Volume';
import { View } from '../View';
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
      : <div>
        <div className="cards-container">
          <Card className="cards-container__small-card" size="small" title={overviewLangResources.balances.title}>
            <BalancesPure />
          </Card>

          {/*eslint-disable-next-line max-len*/}
          <Card className="cards-container__small-card" size="small" title={`${overviewLangResources.incoming.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">All Month</a>}>
            <IncomingPure />
          </Card>

          {/*eslint-disable-next-line max-len*/}
          <Card className="cards-container__small-card" size="small" title={`${overviewLangResources.outgoing.title} (${commonLangResources.comingSoon})`} extra={<a href="#void">All Month</a>}>
            <OutgoingPure />
          </Card>
        </div>
        <div className="overview-analytics-container">
          <OperationsCountPure period={Period.LastMonth} operationType={'all'} />
          <VolumePure period={Period.LastMonth} operationType={'all'} />
        </div>
      </div>}
  </View >;
};

export const OverviewPure = React.memo(Overview);
