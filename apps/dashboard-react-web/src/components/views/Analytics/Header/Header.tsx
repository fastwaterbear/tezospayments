import { Radio, RadioChangeEvent } from 'antd';
import React, { useCallback } from 'react';

import { useCurrentLanguageResources } from '../../../hooks';

import './Header.scss';

interface HeaderProps {
  isServicesAnalytics: boolean;
  onServicesAnalyticsChange: (value: boolean) => void;
}

export const Header = (props: HeaderProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  const handleRadioChange = useCallback((e: RadioChangeEvent) => {
    props.onServicesAnalyticsChange(e.target.value);
  }, [props]);

  return <div className="analytics-header">
    <h1 className="analytics-header__title">{analyticsLangResources.title}</h1>
    <div>
      <Radio.Group onChange={handleRadioChange} value={props.isServicesAnalytics}>
        <Radio.Button value={true}>Services</Radio.Button>
        <Radio.Button value={false}>Donations</Radio.Button>
      </Radio.Group>
    </div>
  </div>;
};

export const HeaderPure = React.memo(Header);
