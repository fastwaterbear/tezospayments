import { Card } from 'antd';
import BigNumber from 'bignumber.js';
import React from 'react';

import { Donation, Payment, PaymentType } from '@tezospayments/common';

import { DirectLinkGeneratorPure } from './DirectLinkGenerator';
import { FailedValidationResult } from './FailedValidationResult';

import './Generator.scss';

interface GeneratorProps {
  serviceAddress: string | undefined;
  paymentType: PaymentType;
  asset: string | undefined;
  amount: string;
  paymentId: string;
  clientData: Record<string, unknown> | undefined;
}

export const Generator = (props: GeneratorProps) => {
  const tabList = [
    { key: 'directLink', tab: 'Direct Link' },
    { key: 'widget', tab: 'Widget', disabled: true },
    { key: 'typescript', tab: 'TypeScript Library', disabled: true },
    { key: 'dotnet', tab: '.NET Library', disabled: true },
  ];

  const paymentOrDonation = props.paymentType === PaymentType.Payment
    ? {
      type: props.paymentType,
      targetAddress: props.serviceAddress,
      id: props.paymentId,
      asset: props.asset,
      amount: new BigNumber(props.amount),
      created: new Date(),
      signature: {
        signingPublicKey: 'edpkuWJYhY5TVZ6xaoubNkidXArJmVhjA2yuZZuucEN6FF4fQeV9Dd',
        contract: 'edsigtaNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNoneNog2Ndso',
      }
    } as Payment
    : {
      type: props.paymentType,
      targetAddress: props.serviceAddress,
      data: props.clientData
    } as Donation;

  const failedValidationResults = paymentOrDonation.type === PaymentType.Payment
    ? Payment.validate(paymentOrDonation)
    : Donation.validate(paymentOrDonation);

  return <Card
    className="generator"
    style={{ width: '100%' }}
    tabList={tabList}
    activeTabKey={tabList[0]?.key}
  >
    {failedValidationResults
      ? <FailedValidationResult results={failedValidationResults} />
      : <DirectLinkGeneratorPure paymentOrDonation={paymentOrDonation} />}
  </Card >;
};

export const GeneratorPure = React.memo(Generator);
