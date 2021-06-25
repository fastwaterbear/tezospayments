import React from 'react';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

import { OperationStatus, OperationType } from '../../../models/blockchain/operation';
import './OperationList.scss';
import { useCurrentLanguageResources } from '../../hooks';
import { OperationIconPure } from './OperationIcon';

interface OperationListProps {
  children: React.ReactNode;
}

export const OperationList = (props: OperationListProps) => {
  return <div className="operation-list">
    {props.children}
  </div>;
};

interface OperationListItemProps {
  type: OperationType;
  status: OperationStatus;
  date: Date;
  hash: string;
  serviceAddress: string;
  accountAddress: string;
  data: string;
  value: number;
  ticker: string;
}

const OperationListItem = (props: OperationListItemProps) => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations.operationList;

  const isIncome = props.type === OperationType.DonationIncome || props.type === OperationType.PaymentIncome;
  //TODO: fix service detection
  const from = isIncome ? getShortHash(props.accountAddress) : 'Service 1';
  const to = isIncome ? 'Service 1' : getShortHash(props.accountAddress);

  const hash = getShortHash(props.hash);
  const isDonation = props.type === OperationType.DonationExpense || props.type === OperationType.DonationIncome;
  const data = `${isDonation ? operationsLangResources.donationData : operationsLangResources.paymentData} ${props.data}`;

  const sign = isIncome ? '+' : '−';
  const amountClassNames = combineClassNames('operation-list-item__amount',
    { 'operation-list-item__amount_income': isIncome },
    { 'operation-list-item__amount_expense': !isIncome },
    { 'operation-list-item__amount_cancelled': props.status === OperationStatus.Cancelled }
  );

  return <div className="operation-list-row">
    <div className="operation-list-item__icon">
      <OperationIconPure type={props.type} status={props.status} />
    </div>
    <div className="operation-list-item__main-info">
      <span className="operation-list-item__date">{props.date.toLocaleString()}</span>
      {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
      <a href="#" className="operation-list-item__operation-hash">{hash}</a>
      <span className="operation-list-item__data">{data}</span>
    </div>
    <div className="operation-list-item__transfer-info">
      {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
      <a href="#">{from}</a> → <a href="#">{to}</a>
    </div>
    <div className={amountClassNames}>{sign}{props.value} {props.ticker}</div>
  </div>;
};

const getShortHash = (hash: string) => `${hash.substr(0, 9)}...${hash.substr(hash.length - 6, 6)}`;

OperationList.Item = OperationListItem;
