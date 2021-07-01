import React from 'react';

import { Service } from '@tezos-payments/common/dist/models/service';
import { Payment as PaymentModel } from '@tezos-payments/common/src/models/payment';

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
  return <View className="payment-view">
    <View.Side isRight={false}>
      <PaymentDetails paymentData={props.payment.data} />
      <ServiceInfoPure service={props.service} />
    </View.Side>
    <View.Side isRight={true}>
      <TotalAmount value={props.payment.amount} />
      <PayButtonPure text="Pay" />
      <FooterPure />
    </View.Side>
  </View>;
};

export const PaymentPure = React.memo(Payment);
