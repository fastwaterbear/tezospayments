import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
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
    { 'operation-icon__income': isIncome },
    { 'operation-icon__expense': !isIncome },
  );

  return <div className={className}>
    {isIncome ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
  </div >;
};

export const OperationIconPure = React.memo(OperationIcon);
