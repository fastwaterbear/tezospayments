import { Card } from 'antd';
import React from 'react';

import { ExternalLink } from '../../../common';
import { useCurrentLanguageResources } from '../../../hooks';

import './Generator.scss';

export const Generator = () => {
  const langResources = useCurrentLanguageResources();
  const acceptPaymentsLangResources = langResources.views.acceptPayments;

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
      <span className="generator__direct-link-help-text">{acceptPaymentsLangResources.directLinkHelpText}</span>
      <ExternalLink className="generator__direct-link-link" href={url}>{url}</ExternalLink>
    </div>
  </Card >;
};

export const GeneratorPure = React.memo(Generator);
