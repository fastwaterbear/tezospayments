import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { internal as tezosPaymentsInternal } from 'tezospayments';

import { Donation, Payment, PaymentType, networks } from '@tezospayments/common';

import { config } from '../../../../../config';
import { getCurrentAccount } from '../../../../../store/accounts/selectors';
import { ExternalLink } from '../../../../common';
import { useAppSelector, useCurrentLanguageResources, useTezosPayments } from '../../../../hooks';

import './DirectLinkGenerator.scss';

interface DirectLinkGeneratorProps {
  paymentOrDonation: Payment | Donation;
  serviceAddress: string | undefined;
}

const base64PaymentUrlFactory = new tezosPaymentsInternal.paymentUrlFactories.Base64PaymentUrlFactory(
  config.links.tezosPayments.paymentsApp
);

export const DirectLinkGenerator = ({ paymentOrDonation, serviceAddress }: DirectLinkGeneratorProps) => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const acceptPaymentsLangResources = langResources.views.acceptPayments;
  const currentAccount = useAppSelector(getCurrentAccount);
  const tezosPayments = useTezosPayments(serviceAddress);

  const [url, setUrl] = useState('');

  const getPaymentLink = useCallback(
    async () => {
      const network = currentAccount?.network || networks[config.tezos.defaultNetwork];

      if (paymentOrDonation.type === PaymentType.Donation)
        return base64PaymentUrlFactory.createPaymentUrl(paymentOrDonation, network);

      if (!tezosPayments)
        return '';

      try {
        const payment = await tezosPayments.createPayment({
          id: paymentOrDonation.id,
          amount: paymentOrDonation.amount.toString(),
          asset: paymentOrDonation.asset,
          created: Date.now(),
          data: paymentOrDonation.data,
        });

        return payment.url;
      }
      catch (e) {
        console.error(e);
        return '';
      }
    }, [currentAccount?.network, paymentOrDonation, tezosPayments]
  );

  useEffect(() => {
    (async () => {
      setUrl(paymentOrDonation.type === PaymentType.Payment ? '' : await getPaymentLink());
    })();
  }, [getPaymentLink, paymentOrDonation]);

  const helpText = paymentOrDonation.type === PaymentType.Payment
    ? acceptPaymentsLangResources.directLinkPaymentHelpText
    : acceptPaymentsLangResources.directLinkDonationHelpText;

  const handleGenerateAndSignClick = useCallback(() => {
    (async () => {
      setUrl(await getPaymentLink());
    })();
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
