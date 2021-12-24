import { Card } from 'antd';
import React from 'react';

import { OperationDirection } from '@tezospayments/common';

import { Period } from '../../../models/system';
import { selectServicesState } from '../../../store/services/selectors';
import { NoServicesCreatedPure } from '../../common/NoServicesCreated';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { OperationsCountByTokensPure } from '../Analytics/Charts/OperationsCountByTokens';
import { VolumePure } from '../Analytics/Charts/Volume';
import { View } from '../View';
import { BalancesPure, TotalVolumePure } from './SmallCards';
import './Overview.scss';

export const Overview = () => {
  const langResources = useCurrentLanguageResources();
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

          <Card className="cards-container__small-card" size="small" title={overviewLangResources.incoming.title}>
            <TotalVolumePure direction={OperationDirection.Incoming} />
          </Card>

          <Card className="cards-container__small-card" size="small" title={overviewLangResources.outgoing.title}>
            <TotalVolumePure direction={OperationDirection.Outgoing} />
          </Card>
        </div>
        <div className="overview-analytics">
          <OperationsCountByTokensPure className="overview-analytics__chart" period={Period.All} operationType="all" showZoom={false} />
          <VolumePure className="overview-analytics__chart" period={Period.All} operationType="all" showZoom={false} />
        </div>
      </div>}
  </View >;
};

export const OverviewPure = React.memo(Overview);
