import React, { useState, useEffect } from 'react';

import { Payment as PaymentModel, Service } from '@tezospayments/common';

import { NetworkPayment, } from '../../../models/payment';
import { getTokenBalanceIsEnough } from '../../../store/balances/helpers';
import { selectBalancesState } from '../../../store/balances/selectors';
import { selectUserConnected } from '../../../store/currentPayment/selectors';
import { selectSwapState } from '../../../store/swap/selectors';
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
  const balances = useAppSelector(selectBalancesState);
  const enoughBalance = getTokenBalanceIsEnough(props.payment.asset?.address, props.payment.amount, balances);
  const swapTokensState = useAppSelector(selectSwapState);

  const networkPayment: NetworkPayment = {
    type: props.payment.type,
    targetAddress: props.payment.targetAddress,
    id: props.payment.id,
    amount: props.payment.amount,
    asset: props.payment.asset,
    signature: props.payment.signature.contract
  };

  const defaultSwapAsset = swapTokensState?.tezos ? '' : swapTokensState?.tokens ? Object.keys(swapTokensState.tokens)[0] : undefined;
  const [swapAsset, setSwapAsset] = useState(defaultSwapAsset);
  useEffect(() => setSwapAsset(defaultSwapAsset), [defaultSwapAsset]);
  const showTokenSwapper = connected && !enoughBalance;

  const payButtonText = `${connected && swapAsset !== undefined ? 'Swap and ' : ''} Pay`;
  const payButtonDisabled = showTokenSwapper && swapAsset === undefined;

  return <View className="payment-view">
    <View.Side isRight={false}>
      <PaymentDetails paymentId={props.payment.id} paymentData={props.payment.data} />
      <ServiceInfoPure service={props.service} showDescription={false} />
    </View.Side>
    <View.Side isRight={true}>
      <div className="payment">
        <TotalAmount value={props.payment.amount} assetAddress={props.payment.asset?.address}
          network={props.service.network} />
        {showTokenSwapper && <TokenSwapperPure
          amount={props.payment.amount}
          payAsset={props.payment.asset?.address || ''}
          swapAsset={swapAsset}
          onSwapAssetChange={v => setSwapAsset(v)}
        />}
        <PayButtonPure networkPayment={networkPayment} text={payButtonText} fastMode disabled={payButtonDisabled} swapAsset={swapAsset} />
      </div>
      <FooterPure />
    </View.Side>
  </View>;
};

export const PaymentPure = React.memo(Payment);
