import { Skeleton } from 'antd';
import React from 'react';

import { ServiceOperation, ServiceOperationDirection } from '@tezospayments/common/dist/models/service';

import { getSortedOperations } from '../../../store/operations/selectors';
import { selectServicesState } from '../../../store/services/selectors';
import { NoServicesCreated } from '../../common/NoServicesCreated';
import { OperationList } from '../../common/OperationList';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { NoOperationsPerformedPure } from './NoOperationsPerformed';

export const Operations = () => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations;

  const operations = useAppSelector(getSortedOperations);

  const servicesState = useAppSelector(selectServicesState);

  const operationProps: Array<React.ComponentProps<typeof OperationList.Item>> = operations.map(o => ({
    date: o.date,
    hash: o.hash,
    data: ServiceOperation.publicPayloadExists(o) ? o.payload.public.valueString : '',
    accountAddress: o.sender,
    serviceAddress: o.target,
    serviceName: servicesState.services.filter(s => s.contractAddress === o.target)[0]?.name || '',
    ticker: 'XTZ',
    value: o.amount,
    status: o.status,
    type: o.type,
    direction: ServiceOperationDirection.Incoming
  }));

  return <View title={operationsLangResources.title}>
    <View.Title>{operationsLangResources.title}</View.Title>
    {!servicesState.initialized
      ? <Skeleton active />
      : !servicesState.services.length
        ? <NoServicesCreated />
        : !operations.length
          ? <NoOperationsPerformedPure />
          : <OperationList>
            {operationProps.map(o => <OperationList.Item key={o.hash} {...o} />)}
          </OperationList>}
  </View>;
};

export const OperationsPure = React.memo(Operations);
