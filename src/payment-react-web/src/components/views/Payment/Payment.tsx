
import React from 'react';

import { Payment as PaymentModel, Service } from '@tezospayments/common';

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
    id: props.payment.id,
    amount: props.payment.amount,
    asset: props.payment.asset,
    signature: props.payment.signature.contract
  };

  return <View className="payment-view">
    <View.Side isRight={false}>
      <PaymentDetails paymentId={props.payment.id} paymentData={props.payment.data} />
      <ServiceInfoPure service={props.service} showDescription={false} />
    </View.Side>
    <View.Side isRight={true}>
      <TotalAmount value={props.payment.amount} asset={props.payment.asset}
        network={props.service.network} />
      <PayButtonPure networkPayment={networkPayment} text="Pay" />
      <FooterPure />
    </View.Side>
  </View>;
};

export const PaymentPure = React.memo(Payment);
