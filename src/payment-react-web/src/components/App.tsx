import React, { useEffect, useState } from 'react';

import { Payment } from '@tezos-payments/common/src/models/payment';

import { app } from '../app';
import { PaymentViewPure } from './PaymentView';
import './App.scss';

export const App = () => {
  const [payment, setPayment] = useState<undefined | string | Payment>();

  useEffect(() => {
    const parseCurrentPayment = async () => {
      setPayment(await app.localPaymentService.parseCurrentPayment());
    };

    parseCurrentPayment();
  }, []);

  return <React.Fragment>
    {payment ?
      typeof payment === 'string'
        ? null
        : <PaymentViewPure />
      : null
    }
  </React.Fragment>;
};
