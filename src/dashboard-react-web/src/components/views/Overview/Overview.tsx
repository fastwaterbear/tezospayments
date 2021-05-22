import React from 'react';

import { ButtonPure, Card, CardPure } from '../../common';
import { View } from '../View';
import './Overview.scss';

export const Overview = () => {
  return <View title="Overview" className="overview">
    <View.Title>Overview</View.Title>
    <CardPure>
      <Card.Header>Balances</Card.Header>
    </CardPure>
    <CardPure>
      <Card.Header>Incoming per Month</Card.Header>
    </CardPure>
    <CardPure>
      <Card.Header>Outgoing per Month</Card.Header>
    </CardPure>
    <ButtonPure>Create Service</ButtonPure>
  </View>;
};

export const OverviewPure = React.memo(Overview);
