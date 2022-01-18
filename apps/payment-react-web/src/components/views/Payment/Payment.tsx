import BigNumber from 'bignumber.js';
import React from 'react';

import { Payment as PaymentModel, Service } from '@tezospayments/common';

import { NetworkPayment } from '../../../models/payment';
import { FooterPure } from '../../Footer';
import { PayButtonPure } from '../../PayButton';
import { ServiceInfoPure } from '../../ServiceInfo';
import { useAppSelector } from '../../hooks';
import { View } from '../View';
import { PaymentDetails } from './PaymentDetails';
import { TotalAmount } from './TotalAmount';

interface PaymentProps {
  payment: PaymentModel;
  service: Service;
}

export const Payment = (props: PaymentProps) => {
  const balances = useAppSelector(state => state.balancesState);

  const networkPayment: NetworkPayment = {
    type: props.payment.type,
    targetAddress: props.payment.targetAddress,
    id: props.payment.id,
    amount: props.payment.amount,
    asset: props.payment.asset,
    signature: props.payment.signature.contract
  };

  const balanceAmount = !balances
    ? new BigNumber(0)
    : props.payment.asset
      ? balances.tokens[props.payment.asset.address] || new BigNumber(0)
      : balances.tezos;

  const enoughAmount = !balances || balanceAmount.isGreaterThanOrEqualTo(props.payment.amount);

  return <View className="payment-view">
    <View.Side isRight={false}>
      <PaymentDetails paymentId={props.payment.id} paymentData={props.payment.data} />
      <ServiceInfoPure service={props.service} showDescription={false} />
    </View.Side>
    <View.Side isRight={true}>
      <TotalAmount value={props.payment.amount} assetAddress={props.payment.asset?.address}
        network={props.service.network} />
      <PayButtonPure networkPayment={networkPayment} text="Pay" disabled={!enoughAmount} />
      <FooterPure />
    </View.Side>
  </View>;
};

export const PaymentPure = React.memo(Payment);
