import { ArrowRightOutlined, ArrowLeftOutlined, ClockCircleTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import React from 'react';

import { combineClassNames } from '@tezos-payments/common/dist/utils';

import { OperationStatus, OperationType } from '../../../models/blockchain/operation';
import './OperationIcon.scss';

interface OperationIconProps {
  className?: string;
  type: OperationType;
  status: OperationStatus;
}

export const OperationIcon = (props: OperationIconProps) => {
  const isIncome = props.type === OperationType.DonationIncome || props.type === OperationType.PaymentIncome;

  const className = combineClassNames(
    props.className,
    'operation-icon',
    { 'operation-icon_income': isIncome },
    { 'operation-icon_expense': !isIncome },
    { 'operation-icon_cancelled': props.status === OperationStatus.Cancelled }
  );

  return <div className={className}>
    {isIncome ? <ArrowRightOutlined title={'Income'} /> : <ArrowLeftOutlined title={'Expense'} />}
    {props.status === OperationStatus.Pending && <ClockCircleTwoTone className="operation-icon__status operation-icon__status_pending" title={'Pending'} />}
    {props.status === OperationStatus.Cancelled && <ExclamationCircleFilled className="operation-icon__status operation-icon__status_cancelled" title={'Cancelled'} />}
  </div >;
};

export const OperationIconPure = React.memo(OperationIcon);
