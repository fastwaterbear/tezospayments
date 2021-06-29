import { Result, Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { app } from '../app';
import { PaymentStatus } from '../models/payment';
import { PaymentInfo } from '../models/payment/paymentInfo';
import { PaymentPure } from './views';

import './App.scss';

export const App = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.Unknown);
  const [error, setError] = useState<string>();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>();

  useEffect(() => {
    const parseCurrentPayment = async () => {
      const paymentInfoResult = await app.localPaymentService.getCurrentPaymentInfo();
      if (!paymentInfoResult.isServiceError) {
        setPaymentInfo(paymentInfoResult);
        setPaymentStatus(PaymentStatus.Opened);
      } else {
        setError(paymentInfoResult.error);
        setPaymentStatus(PaymentStatus.Error);
      }
    };

    parseCurrentPayment();
  }, []);

  const handlePaymentStatusUpdated = useCallback((paymentStatus: PaymentStatus, message?: string) => {
    setPaymentStatus(paymentStatus);
    setError(message);
  }, []);

  return <React.Fragment>
    {paymentStatus === PaymentStatus.Unknown && <Spin size="large" />}
    {paymentStatus === PaymentStatus.Opened && !!paymentInfo &&
      <PaymentPure payment={paymentInfo.payment} service={paymentInfo.service} onPaymentStatusUpdated={handlePaymentStatusUpdated} />}
    {paymentStatus === PaymentStatus.Error && <Result status="error" title="Error" subTitle={error} />}
  </React.Fragment>;
};
