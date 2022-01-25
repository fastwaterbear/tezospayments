import React from 'react';

import { Payment as PaymentModel, Service } from '@tezospayments/common';

import { NetworkPayment, } from '../../../models/payment';
import { getSelectTokenBalanceIsEnough } from '../../../store/balances/selectors';
import { selectUserConnected } from '../../../store/currentPayment/selectors';
import { FooterPure } from '../../Footer';
import { PayButtonPure } from '../../PayButton';
import { ServiceInfoPure } from '../../ServiceInfo';
import { TokenSwapperPure } from '../../common';
import { useAppSelector } from '../../hooks';
import { View } from '../View';
import { PaymentDetails } from './PaymentDetails';
import { TotalAmount } from './TotalAmount';

import './Payment.scss';

interface PaymentProps {
  payment: PaymentModel;
  service: Service;
}

export const Payment = (props: PaymentProps) => {
  const connected = useAppSelector(selectUserConnected);
  const enoughBalance = useAppSelector(getSelectTokenBalanceIsEnough(props.payment.asset?.address, props.payment.amount));

  const networkPayment: NetworkPayment = {
    type: props.payment.type,
    targetAddress: props.payment.targetAddress,
    id: props.payment.id,
    amount: props.payment.amount,
    asset: props.payment.asset,
    signature: props.payment.signature.contract
  };

  const swapRequired = connected && !enoughBalance;

  return <View className="payment-view">
    <View.Side isRight={false}>
      <PaymentDetails paymentId={props.payment.id} paymentData={props.payment.data} />
      <ServiceInfoPure service={props.service} showDescription={false} />
    </View.Side>
    <View.Side isRight={true}>
      <div className="payment">
        <TotalAmount value={props.payment.amount} assetAddress={props.payment.asset?.address}
          network={props.service.network} />
        {swapRequired && <TokenSwapperPure amount={props.payment.amount} assetAddress={props.payment.asset?.address} />}
        <PayButtonPure networkPayment={networkPayment} text="Pay" fastMode disabled={swapRequired} />
      </div>
      <FooterPure />
    </View.Side>
  </View>;
};

export const PaymentPure = React.memo(Payment);
