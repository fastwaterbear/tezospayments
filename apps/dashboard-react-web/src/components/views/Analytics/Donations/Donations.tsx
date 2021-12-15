import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { OperationsCountPure } from '../Charts/OperationsCount';
import { ProfitPure } from '../Charts/Profit';

interface DonationsProps {
  period: Period;
}

export const Donations = (props: DonationsProps) => {
  const operationType = OperationType.Donation;

  return <div className="analytics-container">
    <ProfitPure period={props.period} operationType={operationType} />
    <OperationsCountPure period={props.period} operationType={operationType} />
  </div>;
};

export const DonationsPure = React.memo(Donations);
