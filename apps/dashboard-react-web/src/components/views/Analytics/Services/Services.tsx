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

  return <div className="analytics">
    <ProfitPure className="analytics__chart" period={props.period} operationType={operationType} />
    <VolumePure className="analytics__chart" period={props.period} operationType={operationType} />
    <OperationsCountPure className="analytics__chart" period={props.period} operationType={operationType} />
  </div>;
};

export const ServicesPure = React.memo(Services);
