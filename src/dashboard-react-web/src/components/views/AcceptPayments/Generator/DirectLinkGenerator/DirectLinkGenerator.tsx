import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback } from 'react';

import { RawPayment } from '@tezospayments/common/dist/helpers/paymentParser/paymentParser';
import { Network, networks } from '@tezospayments/common/dist/models/blockchain';
import { Donation, Payment, PaymentType } from '@tezospayments/common/dist/models/payment';

import { config } from '../../../../../config';
import { getCurrentAccount } from '../../../../../store/accounts/selectors';
import { ExternalLink } from '../../../../common';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

import './DirectLinkGenerator.scss';

interface DirectLinkGeneratorProps {
  paymentOrDonation: Payment | Donation;
}

export const DirectLinkGenerator = ({ paymentOrDonation }: DirectLinkGeneratorProps) => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const acceptPaymentsLangResources = langResources.views.acceptPayments;
  const currentAccount = useAppSelector(getCurrentAccount);

  const url = getPaymentLink(paymentOrDonation, currentAccount?.network || networks[config.tezos.defaultNetwork]);

  const helpText = paymentOrDonation.type === PaymentType.Payment
    ? acceptPaymentsLangResources.directLinkPaymentHelpText
    : acceptPaymentsLangResources.directLinkDonationHelpText;

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

//TODO: move to common package
const getPaymentLink = (paymentOrDonation: Payment | Donation, network: Network) => {
  const isPayment = paymentOrDonation.type === PaymentType.Payment;

  const rawPayment = isPayment ? {
    created: +new Date(),
    amount: (paymentOrDonation as Payment).amount.toString(10),
    data: (paymentOrDonation as Payment).data
  } as RawPayment : null;

  const baseUrl = config.links.tezosPayments.paymentsApp;
  const address = paymentOrDonation.targetAddress;
  const operation = isPayment ? 'payment' : 'donation';
  const networkSegment = network.name === config.tezos.defaultNetwork ? '' : `?network=${network.name}`;
  const base64 = rawPayment ? Buffer.from(JSON.stringify(rawPayment), 'utf8').toString('base64') : null;

  return `${baseUrl}/${address}/${operation}${networkSegment ? networkSegment : ''}${base64 ? `#${base64}` : ''}`;
};
