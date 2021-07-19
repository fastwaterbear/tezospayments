import { Skeleton } from 'antd';
import React from 'react';

import { ServiceOperation, ServiceOperationDirection } from '@tezospayments/common/dist/models/service';


import { getSortedOperations, selectOperationsState } from '../../../store/operations/selectors';
import { OperationList } from '../../common/OperationList';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';

export const Operations = () => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations;

  const isInitialized = useAppSelector(selectOperationsState).initialized;
  const operations = useAppSelector(getSortedOperations);

  const operationProps: Array<React.ComponentProps<typeof OperationList.Item>> = operations.map(o => ({
    date: o.date,
    hash: o.hash,
    data: ServiceOperation.publicPayloadExists(o) ? o.payload.public.valueString : '',
    accountAddress: o.sender,
    serviceAddress: o.target,
    ticker: 'XTZ',
    value: o.amount,
    status: o.status,
    type: o.type,
    direction: ServiceOperationDirection.Incoming
  }));

  return <View title={operationsLangResources.title}>
    <View.Title>{operationsLangResources.title}</View.Title>
    {!isInitialized
      ? <Skeleton active />
      : <OperationList>
        {operationProps.map(o => <OperationList.Item key={o.hash} {...o} />)}
      </OperationList>}
  </View>;
};

export const OperationsPure = React.memo(Operations);
