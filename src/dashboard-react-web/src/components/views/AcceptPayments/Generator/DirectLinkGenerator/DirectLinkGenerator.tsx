import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { internal as tezosPaymentsInternal } from 'tezospayments';

import { Donation, Payment, PaymentType, networks } from '@tezospayments/common';

import { config } from '../../../../../config';
import { getCurrentAccount } from '../../../../../store/accounts/selectors';
import { ExternalLink } from '../../../../common';
import { useAppSelector, useCurrentLanguageResources } from '../../../../hooks';

import './DirectLinkGenerator.scss';

interface DirectLinkGeneratorProps {
  paymentOrDonation: Payment | Donation;
}

const base64PaymentUrlFactory = new tezosPaymentsInternal.paymentUrlFactories.Base64PaymentUrlFactory(
  config.links.tezosPayments.paymentsApp
);

export const DirectLinkGenerator = ({ paymentOrDonation }: DirectLinkGeneratorProps) => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const acceptPaymentsLangResources = langResources.views.acceptPayments;
  const currentAccount = useAppSelector(getCurrentAccount);

  const [url, setUrl] = useState('');

  const getPaymentLink = useCallback(
    () => {
      const network = currentAccount?.network || networks[config.tezos.defaultNetwork];
      try {
        return base64PaymentUrlFactory.createPaymentUrl(paymentOrDonation, network);
      }
      catch {
        return '';
      }
    }, [currentAccount?.network, paymentOrDonation]
  );

  useEffect(() => {
    setUrl(paymentOrDonation.type === PaymentType.Payment ? '' : getPaymentLink());
  }, [getPaymentLink, paymentOrDonation]);

  const helpText = paymentOrDonation.type === PaymentType.Payment
    ? acceptPaymentsLangResources.directLinkPaymentHelpText
    : acceptPaymentsLangResources.directLinkDonationHelpText;

  const handleGenerateAndSignClick = useCallback(() => {
    setUrl(getPaymentLink());
  }, [getPaymentLink]);

  const handleCopyClick = useCallback(() => {
    navigator.clipboard.writeText(url);
  }, [url]);

  return <div className="generator__direct-link">
    {url && <span className="generator__direct-link-help-text">{helpText}</span>}
    <ExternalLink className="generator__direct-link-link" href={url}>{url}</ExternalLink>
    <div className="generator__direct-link-buttons">
      {!url && <Button type="primary" onClick={handleGenerateAndSignClick}>{acceptPaymentsLangResources.generateAndSignPaymentLink}</Button>}
      {url && <Button onClick={handleCopyClick} icon={<CopyOutlined />}>{commonLangResources.copyLink}</Button>}
    </div>
  </div >;
};

export const DirectLinkGeneratorPure = React.memo(DirectLinkGenerator);
