import { CopyOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import BigNumber from 'bignumber.js';
import React from 'react';

import { Donation, Payment, PaymentType } from '@tezospayments/common/dist/models/payment';

import { ExternalLink } from '../../../common';
import { useCurrentLanguageResources } from '../../../hooks';

import './Generator.scss';

interface GeneratorProps {
  serviceAddress: string | undefined;
  paymentType: PaymentType;
  amount: number;
  publicData: string;
  donationData: string;
}

export const Generator = (props: GeneratorProps) => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const acceptPaymentsLangResources = langResources.views.acceptPayments;

  const _data = props.paymentType === PaymentType.Payment
    ? {
      created: new Date(),
      targetAddress: props.serviceAddress,
      type: props.paymentType,
      amount: new BigNumber(props.amount),
      data: { public: { orderId: props.publicData } },
      urls: []
    } as Payment
    : {
      targetAddress: props.serviceAddress,
      type: props.paymentType,
    } as Donation;

  const tabList = [
    { key: 'directLink', tab: 'Direct Link' },
    { key: 'widget', tab: 'Widget', disabled: true },
    { key: 'typescript', tab: 'TypeScript Library', disabled: true },
    { key: 'dotnet', tab: '.NET Library', disabled: true },
  ];

  // eslint-disable-next-line max-len
  const url = 'https://payment.tezospayments.com/KT1TwUi5inZPTJhGBhx1mvCEhWHLYpniKmTB/payment#eyJhbW91bnQiOiIxOS45OSIsImRhdGEiOnsicHVibGljIjp7Im9yZGVySWQiOiJmNTAwMDg0Mi1jNGY5LTRhM2UtYTJiZS0xMThkNTUxMjQ1ZjcifX0sImNyZWF0ZWQiOjE2Mjc4OTM3MzM0NDZ9';

  return <Card
    className="generator"
    style={{ width: '100%' }}
    tabList={tabList}
    activeTabKey={tabList[0]?.key}
  >
    <div className="generator__direct-link">
      <span className="generator__direct-link-help-text">{acceptPaymentsLangResources.directLinkPaymentHelpText}</span>
      <ExternalLink className="generator__direct-link-link" href={url}>{url}</ExternalLink>
      <div className="generator__direct-link-buttons">
        <Button icon={<CopyOutlined />}>{commonLangResources.copyLink}</Button>
      </div>
    </div>
  </Card >;
};

export const GeneratorPure = React.memo(Generator);
