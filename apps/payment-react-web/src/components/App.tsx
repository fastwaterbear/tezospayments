import { Spin } from 'antd';
import React, { useEffect } from 'react';

import { PaymentType } from '@tezospayments/common';

import { PaymentStatus } from '../models/payment';
import { loadCurrentPayment } from '../store/currentPayment';
import { useAppDispatch, useAppSelector } from './hooks';
import { ConfirmationPure, DonationPure, ErrorPure, PaymentPure, SuccessPure } from './views';

import './App.scss';

export const App = () => {
  const payment = useAppSelector(state => state.currentPaymentState?.payment);
  const service = useAppSelector(state => state.currentPaymentState?.service);
  const operationHash = useAppSelector(state => state.currentPaymentState?.operation?.hash);
  const paymentStatus = useAppSelector(state => state.currentPaymentState && state.currentPaymentState?.status);
  const error = useAppSelector(state => state.applicationError);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadCurrentPayment());
  }, [dispatch]);

  return error
    ? <ErrorPure error={error} />
    : (payment && service && paymentStatus !== null)
      ? <>
        {paymentStatus !== PaymentStatus.Succeeded && paymentStatus !== PaymentStatus.NetworkProcessing && (
          payment.type === PaymentType.Payment
            ? <PaymentPure payment={payment} service={service} />
            : <DonationPure donation={payment} service={service} />
        )}
        {operationHash && paymentStatus === PaymentStatus.NetworkProcessing && <ConfirmationPure operationHash={operationHash}
          network={service.network}
        />}
        {operationHash && paymentStatus === PaymentStatus.Succeeded && <SuccessPure operationHash={operationHash}
          network={service.network}
        />}
      </>
      : <Spin size="large" />;
};
