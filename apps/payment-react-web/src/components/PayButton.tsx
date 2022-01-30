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
  swapAsset?: string;
}

export const PayButton = (props: PayButtonProps) => {
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
        if (props.fastMode)
          dispatch(connectWalletAndTryToPay(props.networkPayment));
        else
          dispatch(connectWallet());
      else {
        if (props.networkPayment.type === PaymentType.Payment)
          dispatch(pay({ payment: props.networkPayment, swapAsset: props.swapAsset }));
        else if (props.networkPayment.type === PaymentType.Donation)
          dispatch(donate({ payment: props.networkPayment }));
      }
    },
    [status, props.fastMode, props.networkPayment, props.swapAsset, dispatch]
  );

  const buttonText = props.fastMode || connected ? props.text : 'Connect Wallet';
  const loading = status === PaymentStatus.UserConnecting
    || status === PaymentStatus.UserProcessing
    || status === PaymentStatus.NetworkProcessing;

  return <div className="pay-button-container">
    <Button
      className="pay-button"
      type="primary"
      size="large"
      onClick={handlePayButtonClick}
      disabled={props.disabled}
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
