import BigNumber from 'bignumber.js';
import React, { useCallback, useState, useMemo } from 'react';

import { Donation as DonationModel, Service, tezosMeta } from '@tezospayments/common';

import { NetworkDonation } from '../../../models/payment';
import { getSelectTokenBalanceIsEnough } from '../../../store/balances/selectors';
import { selectTokensState, selectUserConnected } from '../../../store/currentPayment/selectors';
import { FooterPure } from '../../Footer';
import { PayButtonPure } from '../../PayButton';
import { ServiceInfoPure } from '../../ServiceInfo';
import { useAppSelector } from '../../hooks';
import { View } from '../View';
import { DonationAmount } from './DonationAmount';

interface DonationProps {
  donation: DonationModel;
  service: Service;
}

const zeroAmount = new BigNumber(0);
export const Donation = (props: DonationProps) => {
  const tokens = useAppSelector(selectTokensState);
  const connected = useAppSelector(selectUserConnected);

  const defaultAmount = useMemo(
    () => props.donation.desiredAmount ? new BigNumber(props.donation.desiredAmount) : zeroAmount,
    [props.donation.desiredAmount]
  );

  const [networkDonation, setNetworkDonation] = useState<NetworkDonation>({
    type: props.donation.type,
    assetAddress: props.service.allowedTokens.tez ? '' : props.service.allowedTokens.assets[0],
    targetAddress: props.donation.targetAddress,
    amount: defaultAmount
  });

  const decimals = networkDonation.assetAddress ? tokens.get(networkDonation.assetAddress)?.metadata?.decimals || 0 : tezosMeta.decimals;

  const handleDonationAmountChange = useCallback((rawValue: string) => {
    const amount = new BigNumber(new BigNumber(rawValue).toFormat(decimals, { groupSeparator: '', decimalSeparator: '.' }));
    setNetworkDonation(previousNetworkDonation => ({
      ...previousNetworkDonation,
      amount: amount.isPositive() ? amount : zeroAmount
    } as NetworkDonation));
  }, [decimals]);

  const handleAssetChange = useCallback((asset: string) => {
    setNetworkDonation(previousNetworkDonation => ({
      ...previousNetworkDonation,
      assetAddress: asset || undefined,
      amount: defaultAmount
    } as NetworkDonation));
  }, [defaultAmount]);

  const enoughBalance = useAppSelector(getSelectTokenBalanceIsEnough(networkDonation.assetAddress, networkDonation.amount));
  const payButtonDisabled = connected && (networkDonation.amount.isLessThanOrEqualTo(0) || !enoughBalance);

  return <View className="donation-view">
    <View.Side isRight={false}>
      <ServiceInfoPure service={props.service} />
    </View.Side>
    <View.Side isRight={true}>
      <DonationAmount amount={networkDonation.amount} onAmountChange={handleDonationAmountChange}
        asset={networkDonation.assetAddress} onAssetChange={handleAssetChange} service={props.service} />
      <PayButtonPure networkPayment={networkDonation} text="Donate" disabled={payButtonDisabled} />
      <FooterPure />
    </View.Side>
  </View>;
};

export const DonationPure = React.memo(Donation);
