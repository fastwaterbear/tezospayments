import React from 'react';

import { FooterPure } from '../Footer';
import { PayButtonPure } from '../PayButton';
import { ServiceInfoPure } from '../ServiceInfo';
import { View } from '../View';
import { OrderDetails } from './OrderDetails';
import { TotalSum } from './TotalSum';

export const PaymentView = () => {
  return <View className="payment-view">
    <View.Side isRight={false}>
      <OrderDetails />
      <ServiceInfoPure />
    </View.Side>
    <View.Side isRight={true}>
      <TotalSum />
      <PayButtonPure text="Pay" />
      <FooterPure />
    </View.Side>
  </View>;
};

export const PaymentViewPure = React.memo(PaymentView);

