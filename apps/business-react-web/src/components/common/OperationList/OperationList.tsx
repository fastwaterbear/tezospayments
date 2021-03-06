import { BigNumber } from 'bignumber.js';
import React from 'react';
import { Link } from 'react-router-dom';

import { combineClassNames, OperationDirection, OperationStatus, OperationType } from '@tezospayments/common';

import { config } from '../../../config';
import { useCurrentLanguageResources } from '../../hooks';
import { ExplorerLink } from '../ExplorerLink/ExplorerLink';
import { OperationIconPure } from './OperationIcon';

import './OperationList.scss';

interface OperationListProps {
  children: React.ReactNode;
}

export const OperationList = (props: OperationListProps) => {
  return <table className="operation-list">
    {props.children}
  </table>;
};

interface OperationListItemProps {
  type: OperationType;
  direction: OperationDirection;
  status: OperationStatus;
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

  const isIncoming = props.direction === OperationDirection.Incoming;
  const from = isIncoming ? props.accountAddress : props.serviceAddress;
  const to = isIncoming ? props.serviceAddress : props.accountAddress;

  const hash = getShortHash(props.hash);
  const isDonation = props.type === OperationType.Donation;
  const data = `${isDonation ? operationsLangResources.donationData : operationsLangResources.paymentId} ${props.data}`;

  const sign = isIncoming ? '+' : '−';
  const amountClassNames = combineClassNames('operation-list-item__amount',
    { 'operation-list-item__amount_income': isIncoming },
    { 'operation-list-item__amount_expense': !isIncoming },
    { 'operation-list-item__amount_cancelled': props.status === OperationStatus.Cancelled }
  );

  const serviceLink = `${config.routers.services}/${props.serviceAddress}`;

  return <tbody className="operation-list-group">
    <tr className="operation-list-row operation-list-row_general">
      <td className="operation-list-item__icon">
        <OperationIconPure direction={props.direction} status={props.status} />
      </td>
      <td className="operation-list-item__main-info">
        <span className="operation-list-item__date">{props.date.toLocaleString()}</span>
        <ExplorerLink hash={props.hash} className="operation-list-item__operation-hash">{hash}</ExplorerLink>
      </td>
      <td className="operation-list-item__transfer-info">
        {from === props.serviceAddress
          ? <Link to={serviceLink}>{props.serviceName}</Link>
          : <ExplorerLink hash={from}>{getShortHash(from)}</ExplorerLink>}
        &nbsp;→&nbsp;
        {to === props.serviceAddress
          ? <Link to={serviceLink}>{props.serviceName}</Link>
          : <ExplorerLink hash={to}>{getShortHash(to)}</ExplorerLink>}
      </td>
      <td className={amountClassNames}>{sign}{props.value.toFormat()} {props.ticker}</td>
    </tr>
    <tr className="operation-list-row operation-list-row_order-data">
      <td></td>
      <td className="operation-list-item__data" colSpan={3}>
        {data}
      </td>
    </tr>
  </tbody>;
};

const getShortHash = (hash: string) => `${hash.substr(0, 9)}...${hash.substr(hash.length - 6, 6)}`;

OperationList.Item = OperationListItem;
