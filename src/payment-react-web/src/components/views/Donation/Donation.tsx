import BigNumber from 'bignumber.js';
import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Donation as DonationModel, Service, tezosMeta } from '@tezospayments/common';

import { NetworkDonation } from '../../../models/payment';
import { selectTokensState } from '../../../store/currentPayment/selectors';
import { FooterPure } from '../../Footer';
import { PayButtonPure } from '../../PayButton';
import { ServiceInfoPure } from '../../ServiceInfo';
import { View } from '../View';
import { DonationAmount } from './DonationAmount';

interface DonationProps {
  donation: DonationModel;
  service: Service;
}

const zeroAmount = new BigNumber(0);
export const Donation = (props: DonationProps) => {
  const tokens = useSelector(selectTokensState);

  const defaultAmount = useMemo(
    () => props.donation.desiredAmount ? new BigNumber(props.donation.desiredAmount) : zeroAmount,
    [props.donation.desiredAmount]
  );

  const [networkDonation, setNetworkDonation] = useState<NetworkDonation>({
    type: props.donation.type,
    asset: props.service.allowedTokens.tez ? '' : props.service.allowedTokens.assets[0],
    targetAddress: props.donation.targetAddress,
    amount: defaultAmount,
  });

  const decimals = networkDonation.asset ? tokens.get(networkDonation.asset)?.metadata?.decimals || 0 : tezosMeta.decimals;

  const handleDonationAmountChange = useCallback((rawValue: string) => {
    const amount = new BigNumber(new BigNumber(rawValue).toFormat(decimals, { groupSeparator: '', decimalSeparator: '.' }));
    setNetworkDonation(previousNetworkDonation => ({ ...previousNetworkDonation, amount: amount.isPositive() ? amount : zeroAmount }));
  }, [decimals]);

  const handleAssetChange = useCallback((asset: string) => {
    setNetworkDonation(previousNetworkDonation => ({ ...previousNetworkDonation, asset: asset || undefined, amount: defaultAmount }));
  }, [defaultAmount]);

  return <View className="donation-view">
    <View.Side isRight={false}>
      <ServiceInfoPure service={props.service} />
    </View.Side>
    <View.Side isRight={true}>
      <DonationAmount amount={networkDonation.amount} onAmountChange={handleDonationAmountChange}
        asset={networkDonation.asset} onAssetChange={handleAssetChange} service={props.service} />
      <PayButtonPure networkPayment={networkDonation} text="Donate" disabled={networkDonation.amount.isLessThanOrEqualTo(0)} />
      <FooterPure />
    </View.Side>
  </View>;
};

export const DonationPure = React.memo(Donation);
