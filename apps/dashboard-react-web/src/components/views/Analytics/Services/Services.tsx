import React from 'react';

import { OperationDirection, OperationType } from '@tezospayments/common';

import { Period } from '../../../../models/system';
import { OperationsCountByTokensPure } from '../Charts/OperationsCountByTokens';
import { OperationsCountByTypesPure } from '../Charts/OperationsCountByTypes';
import { ProfitPure } from '../Charts/Profit';
import { VolumePure } from '../Charts/Volume';
import { VolumeByTokensPure } from '../Charts/VolumeByTokens';

interface ServicesProps {
  period: Period;
}

export const Services = (props: ServicesProps) => {
  const operationType = OperationType.Payment;

  return <div className="analytics">
    <ProfitPure className="analytics__chart" period={props.period} operationType={operationType} />
    <VolumePure className="analytics__chart" period={props.period} operationType={operationType} />
    <VolumeByTokensPure className="analytics__chart" period={props.period} operationType={operationType} operationDirection={OperationDirection.Incoming} />
    <VolumeByTokensPure className="analytics__chart" period={props.period} operationType={operationType} operationDirection={OperationDirection.Outgoing} />
    <OperationsCountByTokensPure className="analytics__chart" period={props.period} operationType={operationType} />
    <OperationsCountByTypesPure className="analytics__chart" period={props.period} operationType={operationType} />
  </div>;
};

export const ServicesPure = React.memo(Services);
