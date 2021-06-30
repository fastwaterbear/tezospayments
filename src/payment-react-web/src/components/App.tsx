import { Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { app } from '../app';
import { PaymentStatus } from '../models/payment';
import { PaymentInfo } from '../models/payment/paymentInfo';
import { ConfirmationPure, ErrorPure, PaymentPure, SuccessPure } from './views';

import './App.scss';

export const App = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.Unknown);
  const [operationHash, setOperationHash] = useState<string>();
  const [error, setError] = useState<string>();


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

  const handlePaymentStatusUpdated = useCallback((paymentStatus: PaymentStatus, data?: unknown) => {
    setPaymentStatus(paymentStatus);
    if (typeof data === 'string' && data && (paymentStatus === PaymentStatus.NetworkProcessing))
      setOperationHash(data);
    else if (paymentStatus !== PaymentStatus.Succeeded) {
      setOperationHash(undefined);
    }
  }, []);

  return (paymentInfo && paymentStatus !== PaymentStatus.Unknown)
    ? <React.Fragment>
      {paymentStatus !== PaymentStatus.Succeeded && paymentStatus !== PaymentStatus.NetworkProcessing && <PaymentPure payment={paymentInfo.payment}
        service={paymentInfo.service}
        currentPaymentStatus={paymentStatus}
        onPaymentStatusUpdated={handlePaymentStatusUpdated}
      />}
      {operationHash && paymentStatus === PaymentStatus.NetworkProcessing && <ConfirmationPure operationHash={operationHash}
        network={paymentInfo.service.network}
      />}
      {operationHash && paymentStatus === PaymentStatus.Succeeded && <SuccessPure operationHash={operationHash}
        network={paymentInfo.service.network}
      />}
    </React.Fragment>
    : <React.Fragment>
      {paymentStatus === PaymentStatus.Unknown && <Spin size="large" />}
      {paymentStatus === PaymentStatus.Error && <ErrorPure description={error} />}
    </React.Fragment>;
};
