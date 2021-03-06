import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { MaxTransactionPure } from '../Charts/MaxTransaction';
import { NewSendersPure } from '../Charts/NewSenders';
import { OperationsCountByTokensPure } from '../Charts/OperationsCountByTokens';
import { ProfitPure } from '../Charts/Profit';

interface DonationsProps {
  period: Period;
}

export const Donations = (props: DonationsProps) => {
  const operationType = OperationType.Donation;

  return <div className="analytics">
    <ProfitPure className="analytics__chart" period={props.period} operationType={operationType} />
    <OperationsCountByTokensPure className="analytics__chart" period={props.period} operationType={operationType} />
    <NewSendersPure className="analytics__chart" period={props.period} operationType={operationType} />
    <MaxTransactionPure className="analytics__chart" period={props.period} operationType={operationType} />
  </div>;
};

export const DonationsPure = React.memo(Donations);
