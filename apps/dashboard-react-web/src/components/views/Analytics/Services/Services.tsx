import React from 'react';

import { OperationType } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { OperationsCountPure } from '../Charts/OperationsCount';
import { ProfitPure } from '../Charts/Profit';
import { VolumePure } from '../Charts/Volume';

interface ServicesProps {
  period: Period;
}

export const Services = (props: ServicesProps) => {
  const operationType = OperationType.Payment;

  return <div className="analytics-container">
    <ProfitPure period={props.period} operationType={operationType} />
    <VolumePure period={props.period} operationType={operationType} />
    <OperationsCountPure period={props.period} operationType={operationType} />
  </div>;
};

export const ServicesPure = React.memo(Services);
