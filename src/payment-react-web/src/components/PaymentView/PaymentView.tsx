import React from 'react';

import { networks } from '@tezos-payments/common/dist/models/blockchain';
import { Service, ServiceOperationType } from '@tezos-payments/common/dist/models/service';

import { FooterPure } from '../Footer';
import { PayButtonPure } from '../PayButton';
import { ServiceInfoPure } from '../ServiceInfo';
import { View } from '../View';
import { PaymentDetails } from './PaymentDetails';
import { TotalAmount } from './TotalAmount';

export const PaymentView = () => {
  return <View className="payment-view">
    <View.Side isRight={false}>
      <PaymentDetails publicData={testPublicData} />
      <ServiceInfoPure service={testService} />
    </View.Side>
    <View.Side isRight={true}>
      <TotalAmount value={testAmount} />
      <PayButtonPure text="Pay" />
      <FooterPure />
    </View.Side>
  </View>;
};

export const PaymentViewPure = React.memo(PaymentView);

const testPublicData = {
  orderId: 'bcd07c712e744e708d9a9a3183b31233'
};
const testAmount = 23262.2382;
const testService: Service = {
  name: 'Test Service of Fast Water Bear',
  links: [
    'https://fastwaterbear.com',
    'https://github.com/fastwaterbear',
    'https://t.me/fastwaterbear',
    'tezospayment@fastwaterbear.com',
    'xxx://test.com'
  ],
  iconUri: 'https://avatars.githubusercontent.com/u/82229602',
  version: 1,
  metadata: '7b226e616d65223a22546573742053657276696365206f6620466173742057617465722042656172227d',
  contractAddress: 'KT1J5rXFQMG2iHfA4EhpKdFyQVQAVY8wHf6x',
  network: networks.edo2net,
  allowedTokens: {
    tez: true,
    assets: []
  },
  allowedOperationType: ServiceOperationType.All,
  owner: 'tz1aANkwuYKxB1XCyhB3CjMDDBQuPmNcBcCc',
  deleted: false,
  paused: false,
};
