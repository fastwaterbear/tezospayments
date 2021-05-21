import React from 'react';

import { View } from '../View';
import './Overview.scss';

export const Overview = () => {
  return <View title="Overview" className="overview">
    <View.Title>Overview</View.Title>
  </View>;
};

export const OverviewPure = React.memo(Overview);
