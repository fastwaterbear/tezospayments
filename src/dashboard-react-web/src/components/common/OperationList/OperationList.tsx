import { BigNumber } from 'bignumber.js';
import React from 'react';
import { Link } from 'react-router-dom';

import {
  ServiceOperationDirection, ServiceOperationType,
  ServiceOperationStatus, combineClassNames
} from '@tezospayments/common';

import { config } from '../../../config';
import { useCurrentLanguageResources } from '../../hooks';
import { ExplorerLink } from '../ExplorerLink/ExplorerLink';
import { OperationIconPure } from './OperationIcon';

import './OperationList.scss';

interface OperationListProps {
  children: React.ReactNode;
}

export const OperationList = (props: OperationListProps) => {
  return <div className="operation-list">
    {props.children}
  </div>;
};

interface OperationListItemProps {
  type: ServiceOperationType;
  direction: ServiceOperationDirection;
  status: ServiceOperationStatus;
  date: Date;
  hash: string;
  serviceAddress: string;
  serviceName: string;
  accountAddress: string;
  data: string;
  value: BigNumber;
  ticker: string;
}

const OperationListItem = (props: OperationListItemProps) => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations.operationList;

  const isIncoming = props.direction === ServiceOperationDirection.Incoming;
  //TODO: fix service detection
  const from = isIncoming ? props.accountAddress : props.serviceAddress;
  const to = isIncoming ? props.serviceAddress : props.accountAddress;

  const hash = getShortHash(props.hash);
  const isDonation = props.type === ServiceOperationType.Donation;
  const data = `${isDonation ? operationsLangResources.donationData : operationsLangResources.paymentData} ${props.data}`;

  const sign = isIncoming ? '+' : '−';
  const amountClassNames = combineClassNames('operation-list-item__amount',
    { 'operation-list-item__amount_income': isIncoming },
    { 'operation-list-item__amount_expense': !isIncoming },
    { 'operation-list-item__amount_cancelled': props.status === ServiceOperationStatus.Cancelled }
  );

  const serviceLink = `${config.routers.services}/${props.serviceAddress}`;

  return <div className="operation-list-row">
    <div className="operation-list-item__icon">
      <OperationIconPure direction={props.direction} status={props.status} />
    </div>
    <div className="operation-list-item__main-info">
      <span className="operation-list-item__date">{props.date.toLocaleString()}</span>
      <ExplorerLink hash={props.hash} className="operation-list-item__operation-hash">{hash}</ExplorerLink>
      <span className="operation-list-item__data">{data}</span>
    </div>
    <div className="operation-list-item__transfer-info">
      {from === props.serviceAddress
        ? <Link to={serviceLink}>{props.serviceName}</Link>
        : <ExplorerLink hash={from}>{getShortHash(from)}</ExplorerLink>}
      &nbsp;→&nbsp;
      {to === props.serviceAddress
        ? <Link to={serviceLink}>{props.serviceName}</Link>
        : <ExplorerLink hash={to}>{getShortHash(to)}</ExplorerLink>}
    </div>
    <div className={amountClassNames}>{sign}{props.value.toFormat()} {props.ticker}</div>
  </div >;
};

const getShortHash = (hash: string) => `${hash.substr(0, 9)}...${hash.substr(hash.length - 6, 6)}`;

OperationList.Item = OperationListItem;
