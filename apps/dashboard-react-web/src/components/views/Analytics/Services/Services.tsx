import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { useCurrentLanguageResources } from '../../../hooks';
import { ProfitPure } from '../Charts/Profit';

interface ServicesProps {
  period: Period;
}

export const Services = (props: ServicesProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  return <div className="analytics-container">
    <ProfitPure period={props.period} type={OperationType.Payment} title={analyticsLangResources.revenue} ignoreOutgoing />
    <ProfitPure period={props.period} type={OperationType.Payment} title={analyticsLangResources.profit} />
  </div>;
};

export const ServicesPure = React.memo(Services);
