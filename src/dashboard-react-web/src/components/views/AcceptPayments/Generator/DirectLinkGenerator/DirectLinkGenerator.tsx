import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback } from 'react';

import { Donation, Payment, PaymentType } from '@tezospayments/common';

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

  const isPayment = paymentOrDonation.type === PaymentType.Payment;

  const rawPayment = {
    created: +new Date(),
    amount: isPayment ? (paymentOrDonation as Payment).amount.toString(10) : undefined,
    data: isPayment ? (paymentOrDonation as Payment).data : undefined
  };

  const base64 = Buffer.from(JSON.stringify(rawPayment), 'utf8').toString('base64');
  const operation = isPayment ? 'payment' : 'donation';
  const url = `${config.links.tezosPayments.paymentsApp}/${paymentOrDonation.targetAddress}/${operation}/#${base64}`;

  const helpText = isPayment ? acceptPaymentsLangResources.directLinkPaymentHelpText : acceptPaymentsLangResources.directLinkDonationHelpText;

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(url);
  }, [url]);

  return <div className="generator__direct-link">
    <span className="generator__direct-link-help-text">{helpText}</span>
    <ExternalLink className="generator__direct-link-link" href={url}>{url}</ExternalLink>
    <div className="generator__direct-link-buttons">
      <Button onClick={handleCopyClick} icon={<CopyOutlined />}>{commonLangResources.copyLink}</Button>
    </div>
  </div>;
};

export const DirectLinkGeneratorPure = React.memo(DirectLinkGenerator);
