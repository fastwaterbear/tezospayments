import { Button } from 'antd';
import React, { useCallback } from 'react';

import { PaymentType } from '@tezospayments/common';

import { NetworkDonation, NetworkPayment, PaymentStatus } from '../models/payment';
import { connectWallet, donate, pay } from '../store/currentPayment';
import { useAppDispatch, useAppSelector } from './hooks';
import './PayButton.scss';

interface PayButtonProps {
  networkPayment: NetworkPayment | NetworkDonation;
  text: string;
  disabled?: boolean;
}

export const PayButton = ({ networkPayment, text, disabled }: PayButtonProps) => {
  const currentPaymentStatus = useAppSelector(state => state.currentPaymentState && state.currentPaymentState.status);
  const balances = useAppSelector(state => state.balancesState);
  const dispatch = useAppDispatch();

  const handleCancelButtonClick = useCallback(
    () => {
      dispatch(connectWallet());
    }, [dispatch]
  );

  const handlePayButtonClick = useCallback(
    () => {
      if (currentPaymentStatus === PaymentStatus.Initial)
        dispatch(connectWallet());
      else {
        if (networkPayment.type === PaymentType.Payment)
          dispatch(pay(networkPayment));
        else if (networkPayment.type === PaymentType.Donation)
          dispatch(donate(networkPayment));
      }
    },
    [currentPaymentStatus, dispatch, networkPayment]
  );

  const disconnected = !balances;

  const loading = currentPaymentStatus === PaymentStatus.UserConnecting || (currentPaymentStatus === PaymentStatus.UserConnected && !balances)
    || currentPaymentStatus === PaymentStatus.UserProcessing || currentPaymentStatus === PaymentStatus.NetworkProcessing;

  return <div className="pay-button-container">
    <Button
      className="pay-button"
      type="primary"
      size="large"
      onClick={handlePayButtonClick}
      disabled={disabled}
      loading={loading}>
      {disconnected ? 'Connect Wallet' : text}
    </Button>
    <Button
      size="large"
      onClick={handleCancelButtonClick}
      hidden={disconnected}>
      Reconnect
    </Button>
  </div>;
};

export const PayButtonPure = React.memo(PayButton);
