import { Button } from 'antd';
import React, { useCallback } from 'react';

import { PaymentType } from '@tezospayments/common';

import { NetworkDonation, NetworkPayment, PaymentStatus } from '../models/payment';
import { donate, pay } from '../store/currentPayment';
import { useAppDispatch, useAppSelector } from './hooks';
import './PayButton.scss';

interface PayButtonProps {
  networkPayment: NetworkPayment | NetworkDonation;
  text: string;
  disabled?: boolean;
}

export const PayButton = ({ networkPayment, text, disabled }: PayButtonProps) => {
  const currentPaymentStatus = useAppSelector(state => state.currentPaymentState && state.currentPaymentState.status);
  const dispatch = useAppDispatch();

  const handleButtonClick = useCallback(
    () => {
      if (networkPayment.type === PaymentType.Payment)
        dispatch(pay(networkPayment));
      else if (networkPayment.type === PaymentType.Donation)
        dispatch(donate(networkPayment));
    },
    [dispatch, networkPayment]
  );

  return <Button
    className="pay-button"
    type="primary"
    size="large"
    onClick={handleButtonClick}
    disabled={disabled}
    loading={currentPaymentStatus === PaymentStatus.UserProcessing || currentPaymentStatus === PaymentStatus.NetworkProcessing}>
    {text}
  </Button>;
};

export const PayButtonPure = React.memo(PayButton);
