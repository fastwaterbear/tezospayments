import { ArrowRightOutlined, ArrowLeftOutlined, ClockCircleTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import React from 'react';

import { ServiceOperationDirection, ServiceOperationStatus } from '@tezos-payments/common/dist/models/service';
import { combineClassNames } from '@tezos-payments/common/dist/utils';

import './OperationIcon.scss';
import { useCurrentLanguageResources } from '../../hooks';

interface OperationIconProps {
  className?: string;
  direction: ServiceOperationDirection;
  status: ServiceOperationStatus;
}

export const OperationIcon = (props: OperationIconProps) => {
  const langResources = useCurrentLanguageResources();
  const operationsLangResources = langResources.views.operations.operationList;

  const isIncoming = props.direction === ServiceOperationDirection.Incoming;

  const className = combineClassNames(
    props.className,
    'operation-icon',
    { 'operation-icon_income': isIncoming },
    { 'operation-icon_expense': !isIncoming },
    { 'operation-icon_cancelled': props.status === ServiceOperationStatus.Cancelled }
  );

  return <div className={className}>
    {isIncoming ? <ArrowRightOutlined title={operationsLangResources.income} /> : <ArrowLeftOutlined title={operationsLangResources.expense} />}
    {props.status === ServiceOperationStatus.Pending && <ClockCircleTwoTone className="operation-icon__status operation-icon__status_pending" title={operationsLangResources.pending} />}
    {props.status === ServiceOperationStatus.Cancelled && <ExclamationCircleFilled className="operation-icon__status operation-icon__status_cancelled" title={operationsLangResources.cancelled} />}
  </div >;
};

export const OperationIconPure = React.memo(OperationIcon);
