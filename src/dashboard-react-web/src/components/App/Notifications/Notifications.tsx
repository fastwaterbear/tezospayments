import { message } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectServicesState } from '../../../store/services/selectors';
import { PendingOperationStatus } from '../../../store/services/slice';

export const Notifications = () => {
  const { services, pendingOperations } = useSelector(selectServicesState);

  useEffect(() => {
    pendingOperations.forEach(operation => {
      const service = services.find(s => s.contractAddress === operation.serviceAddress);

      const content = <span><b>{operation.action}</b>{service && <> for service: <b>{`${service.name}`}</b></>}</span>;
      const key = operation.hash;

      switch (operation.status) {
        case PendingOperationStatus.loading: {
          const confirmations = `${operation.confirmationCount} / ${operation.targetConfirmationCount}`;
          message.loading({ content: <span>Executing operation: {content} ({confirmations})</span>, key, duration: 0 });
          break;
        }

        case PendingOperationStatus.success:
          message.success({ content: <span>Finished operation: {content}</span>, key, duration: 4 });
          break;

        case PendingOperationStatus.error:
          message.error({ content: <span>Failed operation: {content}</span>, key, duration: 4 });
          break;
      }
    });
  }, [pendingOperations, services]);

  return null;
};

export const NotificationsPure = React.memo(Notifications);
