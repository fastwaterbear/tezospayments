import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { useCurrentLanguageResources } from '../../../hooks';
import { ProfitPure } from '../Charts/Profit';

interface DonationsProps {
  period: Period;
}

export const Donations = (props: DonationsProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  return <div className="analytics-container">
    <ProfitPure period={props.period} type={OperationType.Donation} title={analyticsLangResources.profit} />
  </div>;
};

export const DonationsPure = React.memo(Donations);
