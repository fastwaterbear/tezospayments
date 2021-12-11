import React from 'react';

import { AnalyticsView, Period } from '../../../../models/system';
import { ProfitPure } from '../Charts/Profit';

interface DonationsProps {
  period: Period;
}

export const Donations = (props: DonationsProps) => {
  return <div className="analytics-container">
    <ProfitPure period={props.period} view={AnalyticsView.Donations} />
  </div>;
};

export const DonationsPure = React.memo(Donations);
