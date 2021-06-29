import { Button } from 'antd';
import React, { useCallback } from 'react';

import { PaymentStatus } from '../models/payment';
import './PayButton.scss';

interface PayButtonProps {
  text: string;
  onPaymentStatusUpdated: (paymentStatus: PaymentStatus, message?: string) => void;
}

export const PayButton = ({ onPaymentStatusUpdated, text }: PayButtonProps) => {
  const handleButtonClick = useCallback(
    () => onPaymentStatusUpdated(PaymentStatus.Processing),
    [onPaymentStatusUpdated]
  );

  return <Button className="pay-button" type="primary" size="large" onClick={handleButtonClick}>{text}</Button>;
};

export const PayButtonPure = React.memo(PayButton);
