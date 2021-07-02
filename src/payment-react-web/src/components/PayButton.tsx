import { Button } from 'antd';
import React, { useCallback } from 'react';

import { PaymentStatus } from '../models/payment';
import './PayButton.scss';
import { pay } from '../store/currentPayment';
import { useAppDispatch, useAppSelector } from './hooks';

interface PayButtonProps {
  text: string;
}

export const PayButton = (props: PayButtonProps) => {
  const currentPaymentStatus = useAppSelector(state => state.currentPaymentState && state.currentPaymentState.status);
  const dispatch = useAppDispatch();

  const handleButtonClick = useCallback(
    () => dispatch(pay()),
    [dispatch]
  );

  return <Button
    className="pay-button"
    type="primary"
    size="large"
    onClick={handleButtonClick}
    loading={currentPaymentStatus === PaymentStatus.UserProcessing || currentPaymentStatus === PaymentStatus.NetworkProcessing}>
    {props.text}
  </Button>;
};

export const PayButtonPure = React.memo(PayButton);
