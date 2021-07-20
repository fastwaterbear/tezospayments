
import React from 'react';

import { Payment as PaymentModel } from '@tezospayments/common/dist/models/payment';
import { Service } from '@tezospayments/common/dist/models/service';

import { NetworkPayment } from '../../../models/payment';
import { FooterPure } from '../../Footer';
import { PayButtonPure } from '../../PayButton';
import { ServiceInfoPure } from '../../ServiceInfo';
import { View } from '../View';
import { PaymentDetails } from './PaymentDetails';
import { TotalAmount } from './TotalAmount';

interface PaymentProps {
  payment: PaymentModel;
  service: Service;
}

export const Payment = (props: PaymentProps) => {
  const networkPayment: NetworkPayment = {
    type: props.payment.type,
    targetAddress: props.payment.targetAddress,
    amount: props.payment.amount,
    data: props.payment.data,
    asset: props.payment.asset,
  };

  return <View className="payment-view">
    <View.Side isRight={false}>
      <PaymentDetails paymentData={props.payment.data} />
      <ServiceInfoPure service={props.service} showDescription={false} />
    </View.Side>
    <View.Side isRight={true}>
      <TotalAmount value={props.payment.amount} />
      <PayButtonPure networkPayment={networkPayment} text="Pay" />
      <FooterPure />
    </View.Side>
  </View>;
};

export const PaymentPure = React.memo(Payment);
