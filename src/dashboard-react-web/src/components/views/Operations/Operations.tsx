import React from 'react';

import { OperationStatus, OperationType } from '../../../models/blockchain/operation';
import { OperationList } from '../../common/OperationList';
import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';

export const Operations = () => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations;

  const operations: Array<React.ComponentProps<typeof OperationList.Item>> = [{
    date: new Date('2021-07-20T03:24:00'),
    operationHash: 'opYK5xCdprVxLDEk5jQM9kpGTZT3T8dXJvHvri33CWRTpEDftja',
    data: 'AAA12213NNNDDD23',
    accountAddress: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5',
    serviceAddress: 'tz1UqarjGfmwrd1BBHsXDtvdHx8VQgqKXrcK',
    ticker: 'XTZ',
    value: 10.22,
    status: OperationStatus.Pending,
    type: OperationType.PaymentIncome
  }, {
    date: new Date('2021-07-20T03:24:00'),
    operationHash: 'opYK5xCdprVxLDEk5jQM9kpGTZT3T8dXJvHvri33CWRTpEDftja',
    data: '11254',
    accountAddress: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5',
    serviceAddress: 'tz1UqarjGfmwrd1BBHsXDtvdHx8VQgqKXrcK',
    ticker: 'XTZ',
    value: 100,
    status: OperationStatus.Success,
    type: OperationType.PaymentExpense
  }, {
    date: new Date('2021-07-20T03:24:00'),
    operationHash: 'opYK5xCdprVxLDEk5jQM9kpGTZT3T8dXJvHvri33CWRTpEDftja',
    data: 'Hello',
    accountAddress: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5',
    serviceAddress: 'tz1UqarjGfmwrd1BBHsXDtvdHx8VQgqKXrcK',
    ticker: 'XTZ',
    value: 5,
    status: OperationStatus.Success,
    type: OperationType.DonationIncome
  }, {
    date: new Date('2021-07-20T03:24:00'),
    operationHash: 'opYK5xCdprVxLDEk5jQM9kpGTZT3T8dXJvHvri33CWRTpEDftja',
    data: 'Hello',
    accountAddress: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5',
    serviceAddress: 'tz1UqarjGfmwrd1BBHsXDtvdHx8VQgqKXrcK',
    ticker: 'XTZ',
    value: 5,
    status: OperationStatus.Cancelled,
    type: OperationType.DonationExpense
  }, {
    date: new Date('2021-07-20T03:24:00'),
    operationHash: 'opYK5xCdprVxLDEk5jQM9kpGTZT3T8dXJvHvri33CWRTpEDftja',
    data: 'AAA12213NNNDDD23',
    accountAddress: 'tz1UtQYueaXRV3MfLj4XHaHZziijHRwF31a5',
    serviceAddress: 'tz1UqarjGfmwrd1BBHsXDtvdHx8VQgqKXrcK',
    ticker: 'XTZ',
    value: 350.256,
    status: OperationStatus.Cancelled,
    type: OperationType.PaymentIncome
  }];

  return <View title={operationsLangResources.title}>
    <View.Title>{operationsLangResources.title}</View.Title>

    <OperationList>
      {operations.map((o, i) => <OperationList.Item key={i} {...o} />)}
    </OperationList>
  </View>;
};

export const OperationsPure = React.memo(Operations);
