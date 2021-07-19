import BigNumber from 'bignumber.js';
import React from 'react';

import { Donation as DonationModel } from '@tezospayments/common/dist/models/payment';
import { Service } from '@tezospayments/common/dist/models/service';

import { NetworkDonation } from '../../../models/payment';
import { FooterPure } from '../../Footer';
import { PayButtonPure } from '../../PayButton';
import { ServiceInfoPure } from '../../ServiceInfo';
import { View } from '../View';

interface DonationProps {
  donation: DonationModel;
  service: Service;
}

export const Donation = (props: DonationProps) => {
  const networkDonation: NetworkDonation = {
    type: props.donation.type,
    targetAddress: props.donation.targetAddress,
    amount: new BigNumber(10_000_000),
  };

  return <View className="donation-view">
    <View.Side isRight={false}>
      <ServiceInfoPure service={props.service} />
    </View.Side>
    <View.Side isRight={true}>
      <PayButtonPure networkPayment={networkDonation} text="Donate" />
      <FooterPure />
    </View.Side>
  </View>;
};

export const DonationPure = React.memo(Donation);
