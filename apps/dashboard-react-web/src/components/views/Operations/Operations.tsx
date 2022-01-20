import { Skeleton } from 'antd';
import React from 'react';

import { DonationOperation, Operation, OperationDirection, OperationType, PaymentOperation } from '@tezospayments/common';

import { selectSortedOperations, } from '../../../store/operations/selectors';
import { selectServicesState, selectTokensState } from '../../../store/services/selectors';
import { NoServicesCreated } from '../../common/NoServicesCreated';
import { OperationList } from '../../common/OperationList';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { NoOperationsPerformedPure } from './NoOperationsPerformed';

const getFormattedOperationData = (operation: Operation): string | undefined => {
  switch (operation.type) {
    case OperationType.Payment:
      return (operation as PaymentOperation).paymentId;
    case OperationType.Donation:
      return (operation as DonationOperation).payload?.valueString;
    default:
      return undefined;
  }
};

export const Operations = () => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations;
  const operations = useAppSelector(state => selectSortedOperations(state, 'all'));
  const servicesState = useAppSelector(selectServicesState);
  const tokens = useAppSelector(selectTokensState);

  const operationProps: Array<React.ComponentProps<typeof OperationList.Item>> = operations.map(o => {
    const tokenSymbol = o.asset && tokens.get(o.asset)?.metadata?.symbol;

    return {
      date: o.date,
      hash: o.hash,
      data: getFormattedOperationData(o) || '',
      accountAddress: o.sender,
      serviceAddress: o.target,
      serviceName: servicesState.services.filter(s => s.contractAddress === o.target)[0]?.name || '',
      ticker: tokenSymbol || 'XTZ',
      value: o.amount,
      status: o.status,
      type: o.type,
      direction: OperationDirection.Incoming
    };
  });

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
