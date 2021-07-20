import BigNumber from 'bignumber.js';
import React, { useCallback, useState } from 'react';

import { Donation as DonationModel } from '@tezospayments/common/dist/models/payment';
import { Service } from '@tezospayments/common/dist/models/service';

import { NetworkDonation } from '../../../models/payment';
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
  const [networkDonation, setNetworkDonation] = useState<NetworkDonation>({
    type: props.donation.type,
    targetAddress: props.donation.targetAddress,
    amount: zeroAmount,
  });

  const handleDonationAmountChange = useCallback(
    (rawValue: string) => {
      const value = new BigNumber(rawValue);
      if (value.isPositive())
        setNetworkDonation(previousNetworkDonation => ({ ...previousNetworkDonation, amount: value }));
    },
    []
  );

  return <View className="donation-view">
    <View.Side isRight={false}>
      <ServiceInfoPure service={props.service} />
    </View.Side>
    <View.Side isRight={true}>
      <DonationAmount desiredAmount={props.donation.desiredAmount} onChange={handleDonationAmountChange} />
      <PayButtonPure networkPayment={networkDonation} text="Donate" disabled={networkDonation.amount.isLessThanOrEqualTo(0)} />
      <FooterPure />
    </View.Side>
  </View>;
};

export const DonationPure = React.memo(Donation);
