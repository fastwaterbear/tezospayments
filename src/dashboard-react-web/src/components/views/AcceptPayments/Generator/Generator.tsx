import { Card } from 'antd';
import BigNumber from 'bignumber.js';
import React from 'react';

import { Donation, Payment, PaymentType } from '@tezospayments/common/dist/models/payment';
import { URL } from '@tezospayments/common/dist/native';

import { getSortedServices } from '../../../../store/services/selectors';
import { useAppSelector } from '../../../hooks';
import { DirectLinkGeneratorPure } from './DirectLinkGenerator';

import './Generator.scss';

interface GeneratorProps {
  serviceAddress: string | undefined;
  paymentType: PaymentType;
  amount: number;
  publicData: string;
  donationData: string;
}

export const Generator = (props: GeneratorProps) => {
  const tabList = [
    { key: 'directLink', tab: 'Direct Link' },
    { key: 'widget', tab: 'Widget', disabled: true },
    { key: 'typescript', tab: 'TypeScript Library', disabled: true },
    { key: 'dotnet', tab: '.NET Library', disabled: true },
  ];

  const services = useAppSelector(getSortedServices);
  const urls = services.find(s => s.contractAddress === props.serviceAddress)?.links.map(l => ({
    type: 'base64',
    url: new URL(l)
  }));

  const paymentOrDonation = props.paymentType === PaymentType.Payment
    ? {
      created: new Date(),
      targetAddress: props.serviceAddress,
      type: props.paymentType,
      amount: new BigNumber(props.amount),
      data: props.publicData ? { public: { orderId: props.publicData } } : undefined,
      urls
    } as Payment
    : {
      targetAddress: props.serviceAddress,
      type: props.paymentType,
      urls
    } as Donation;

  const failedValidationResult = paymentOrDonation.type === PaymentType.Payment
    ? Payment.validate(paymentOrDonation)
    : Donation.validate(paymentOrDonation);

  return <Card
    className="generator"
    style={{ width: '100%' }}
    tabList={tabList}
    activeTabKey={tabList[0]?.key}
  >
    {failedValidationResult
      ? JSON.stringify(failedValidationResult)
      : <DirectLinkGeneratorPure paymentOrDonation={paymentOrDonation} />}
  </Card >;
};

export const GeneratorPure = React.memo(Generator);
