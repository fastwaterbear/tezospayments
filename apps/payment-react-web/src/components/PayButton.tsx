import { Button } from 'antd';
import React, { useCallback } from 'react';

import { PaymentType } from '@tezospayments/common';

import { NetworkDonation, NetworkPayment, PaymentStatus } from '../models/payment';
import { connectWallet, connectWalletAndTryToPay, donate, pay } from '../store/currentPayment';
import { selectPaymentStatus, selectUserConnected } from '../store/currentPayment/selectors';
import { useAppDispatch, useAppSelector } from './hooks';

import './PayButton.scss';

interface PayButtonProps {
  networkPayment: NetworkPayment | NetworkDonation;
  text: string;
  fastMode?: boolean;
  disabled?: boolean;
}

export const PayButton = ({ networkPayment, text, disabled, fastMode }: PayButtonProps) => {
  const status = useAppSelector(selectPaymentStatus);
  const connected = useAppSelector(selectUserConnected);
  const dispatch = useAppDispatch();

  const handleReconnectButtonClick = useCallback(
    () => {
      dispatch(connectWallet());
    }, [dispatch]
  );

  const handlePayButtonClick = useCallback(
    () => {
      if (status === PaymentStatus.Initial)
        if (fastMode)
          dispatch(connectWalletAndTryToPay(networkPayment));
        else
          dispatch(connectWallet());
      else {
        if (networkPayment.type === PaymentType.Payment)
          dispatch(pay(networkPayment));
        else if (networkPayment.type === PaymentType.Donation)
          dispatch(donate(networkPayment));
      }
    },
    [status, dispatch, fastMode, networkPayment]
  );

  const buttonText = fastMode || connected ? text : 'Connect Wallet';
  const loading = status === PaymentStatus.UserConnecting
    || status === PaymentStatus.UserProcessing
    || status === PaymentStatus.NetworkProcessing;

  return <div className="pay-button-container">
    <Button
      className="pay-button"
      type="primary"
      size="large"
      onClick={handlePayButtonClick}
      disabled={disabled}
      loading={loading}>
      {buttonText}
    </Button>
    {status === PaymentStatus.UserConnected && <Button
      size="large"
      onClick={handleReconnectButtonClick}>
      Reconnect
    </Button>}
  </div>;
};

export const PayButtonPure = React.memo(PayButton);
