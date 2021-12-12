import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { ProfitPure } from '../Charts/Profit';

interface DonationsProps {
  period: Period;
}

export const Donations = (props: DonationsProps) => {
  return <div className="analytics-container">
    <ProfitPure period={props.period} type={OperationType.Donation} />
  </div>;
};

export const DonationsPure = React.memo(Donations);
