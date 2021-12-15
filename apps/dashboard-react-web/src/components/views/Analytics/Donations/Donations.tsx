import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { useCurrentLanguageResources } from '../../../hooks';
import { OperationsCountPure } from '../Charts/OperationsCount';
import { ProfitPure } from '../Charts/Profit';

interface DonationsProps {
  period: Period;
}

export const Donations = (props: DonationsProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;
  const operationType = OperationType.Donation;

  return <div className="analytics-container">
    <ProfitPure period={props.period} operationType={operationType} />
    <OperationsCountPure period={props.period} operationType={operationType} title={analyticsLangResources.operationsCount} />
  </div>;
};

export const DonationsPure = React.memo(Donations);
