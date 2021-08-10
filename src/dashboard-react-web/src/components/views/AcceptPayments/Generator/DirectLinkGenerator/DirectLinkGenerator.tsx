import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

import { RawPayment } from '@tezospayments/common/dist/helpers/paymentParser/paymentParser';
import { Donation, Payment, PaymentType } from '@tezospayments/common/dist/models/payment';

import { config } from '../../../../../config';
import { ExternalLink } from '../../../../common';
import { useCurrentLanguageResources } from '../../../../hooks';

import './DirectLinkGenerator.scss';

interface DirectLinkGeneratorProps {
  paymentOrDonation: Payment | Donation;
}

export const DirectLinkGenerator = ({ paymentOrDonation }: DirectLinkGeneratorProps) => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const acceptPaymentsLangResources = langResources.views.acceptPayments;

  const rawPayment: RawPayment = {
    created: +new Date(),
    amount: paymentOrDonation.type === PaymentType.Payment ? paymentOrDonation.amount.toString(10) : undefined,
    data: paymentOrDonation.type === PaymentType.Payment ? paymentOrDonation.data : undefined
  };

  const base64 = Buffer.from(JSON.stringify(rawPayment), 'utf8').toString('base64');
  const operation = paymentOrDonation.type === PaymentType.Payment ? 'payment' : 'donation';
  const url = `${config.links.tezosPayments.paymentsApp}/${paymentOrDonation.targetAddress}/${operation}/#${base64}`;

  return <div className="generator__direct-link">
    <span className="generator__direct-link-help-text">{acceptPaymentsLangResources.directLinkPaymentHelpText}</span>
    <ExternalLink className="generator__direct-link-link" href={url}>{url}</ExternalLink>
    <div className="generator__direct-link-buttons">
      <Button icon={<CopyOutlined />}>{commonLangResources.copyLink}</Button>
    </div>
  </div>;
};

export const DirectLinkGeneratorPure = React.memo(DirectLinkGenerator);
