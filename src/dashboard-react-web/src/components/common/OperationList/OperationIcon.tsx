import { ArrowRightOutlined, ArrowLeftOutlined, ClockCircleTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import React from 'react';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

import { OperationStatus, OperationType } from '../../../models/blockchain/operation';
import './OperationIcon.scss';
import { useCurrentLanguageResources } from '../../hooks';

interface OperationIconProps {
  className?: string;
  type: OperationType;
  status: OperationStatus;
}

export const OperationIcon = (props: OperationIconProps) => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations.operationList;

  const isIncome = props.type === OperationType.DonationIncome || props.type === OperationType.PaymentIncome;

  const className = combineClassNames(
    props.className,
    'operation-icon',
    { 'operation-icon_income': isIncome },
    { 'operation-icon_expense': !isIncome },
    { 'operation-icon_cancelled': props.status === OperationStatus.Cancelled }
  );

  return <div className={className}>
    {isIncome ? <ArrowRightOutlined title={operationsLangResources.income} /> : <ArrowLeftOutlined title={operationsLangResources.expense} />}
    {props.status === OperationStatus.Pending && <ClockCircleTwoTone className="operation-icon__status operation-icon__status_pending" title={operationsLangResources.pending} />}
    {props.status === OperationStatus.Cancelled && <ExclamationCircleFilled className="operation-icon__status operation-icon__status_cancelled" title={operationsLangResources.cancelled} />}
  </div >;
};

export const OperationIconPure = React.memo(OperationIcon);
