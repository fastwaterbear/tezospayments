import React from 'react';

import { OperationStatus, OperationType, PaymentType } from '../../../models/blockchain/operation';
import { getSortedOperations } from '../../../store/operations/selectors';
import { OperationList } from '../../common/OperationList';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';

export const Operations = () => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations;

  const operations = useAppSelector(getSortedOperations);

  const operationProps: Array<React.ComponentProps<typeof OperationList.Item>> = operations.map(o => ({
    date: o.date,
    hash: o.hash,
    data: o.parameter.value.payload.public,
    accountAddress: o.sender.address,
    serviceAddress: o.target.address,
    ticker: 'XTZ',
    value: o.amount,
    status: o.status === 'applied' ? OperationStatus.Success : OperationStatus.Cancelled,
    type: o.parameter.value.payload.operation_type === PaymentType.Payment ? OperationType.PaymentIncome : OperationType.DonationIncome
  }));

  return <View title={operationsLangResources.title}>
    <View.Title>{operationsLangResources.title}</View.Title>

    <OperationList>
      {operationProps.map(o => <OperationList.Item key={o.hash} {...o} />)}
    </OperationList>
  </View>;
};

export const OperationsPure = React.memo(Operations);
