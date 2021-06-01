import React from 'react';

import { Card, CardPure } from '../../common';
import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import './Overview.scss';

export const Overview = () => {
  const langResources = useCurrentLanguageResources();
  const overviewLangResources = langResources.views.overview;

  return <View title="Overview" className="overview">
    <View.Title>{overviewLangResources.title}</View.Title>
    <CardPure>
      <Card.Header>{overviewLangResources.balances.title}</Card.Header>
    </CardPure>
    <CardPure>
      <Card.Header>{overviewLangResources.incoming.title}</Card.Header>
    </CardPure>
    <CardPure>
      <Card.Header>{overviewLangResources.outgoing.title}</Card.Header>
    </CardPure>
  </View>;
};

export const OverviewPure = React.memo(Overview);
