import { Button, notification } from 'antd';
import React, { useCallback } from 'react';

import { Payment } from '@tezos-payments/common/dist/models/payment';

import { app } from '../app';
import { PaymentStatus } from '../models/payment';
import './PayButton.scss';

interface PayButtonProps {
  payment: Payment;
  text: string;
  currentPaymentStatus: PaymentStatus;
  onPaymentStatusUpdated: <T>(paymentStatus: PaymentStatus, data?: T) => void;
}

export const PayButton = ({ payment, text, currentPaymentStatus, onPaymentStatusUpdated }: PayButtonProps) => {
  const onPaymentError = useCallback(
    (errorMessage: string) => {
      notification.error({
        message: errorMessage,
        placement: 'bottomRight'
      });
      onPaymentStatusUpdated(PaymentStatus.Error);
    },
    [onPaymentStatusUpdated]
  );

  const handleButtonClick = useCallback(
    () => {
      onPaymentStatusUpdated(PaymentStatus.UserProcessing);

      app.localPaymentService.pay(payment)
        .then(result => {
          if (!result.isServiceError) {
            onPaymentStatusUpdated(PaymentStatus.NetworkProcessing, result.opHash);
            return result.confirmation();
          }
          else
            onPaymentError(result.error);
        })
        .then(transactionWalletOperation => transactionWalletOperation && onPaymentStatusUpdated(PaymentStatus.Succeeded))
        .catch((error: Error | string) => onPaymentError(typeof error === 'string' ? error : error.message));
    },
    [onPaymentError, onPaymentStatusUpdated, payment]
  );

  return <Button
    className="pay-button"
    type="primary"
    size="large"
    onClick={handleButtonClick}
    loading={currentPaymentStatus === PaymentStatus.UserProcessing || currentPaymentStatus === PaymentStatus.NetworkProcessing}>
    {text}
  </Button>;
};

export const PayButtonPure = React.memo(PayButton);
