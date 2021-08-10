import { CopyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

import { ExternalLink } from '../../../../common';
import { useCurrentLanguageResources } from '../../../../hooks';
import './DirectLinkGenerator.scss';

export const DirectLinkGenerator = () => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const acceptPaymentsLangResources = langResources.views.acceptPayments;

  // eslint-disable-next-line max-len
  const url = 'https://payment.tezospayments.com/KT1TwUi5inZPTJhGBhx1mvCEhWHLYpniKmTB/payment#eyJhbW91bnQiOiIxOS45OSIsImRhdGEiOnsicHVibGljIjp7Im9yZGVySWQiOiJmNTAwMDg0Mi1jNGY5LTRhM2UtYTJiZS0xMThkNTUxMjQ1ZjcifX0sImNyZWF0ZWQiOjE2Mjc4OTM3MzM0NDZ9';

  return <div className="generator__direct-link">
    <span className="generator__direct-link-help-text">{acceptPaymentsLangResources.directLinkPaymentHelpText}</span>
    <ExternalLink className="generator__direct-link-link" href={url}>{url}</ExternalLink>
    <div className="generator__direct-link-buttons">
      <Button icon={<CopyOutlined />}>{commonLangResources.copyLink}</Button>
    </div>
  </div>;
};

export const DirectLinkGeneratorPure = React.memo(DirectLinkGenerator);
