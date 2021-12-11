import { Radio, RadioChangeEvent, Select } from 'antd';
import React, { useCallback } from 'react';

import { Language, Period } from '../../../../models/system';
import { useCurrentLanguageResources } from '../../../hooks';

import './Header.scss';

interface HeaderProps {
  isServicesAnalytics: boolean;
  onIsServicesAnalyticsChange: (value: boolean) => void;
  period: Period;
  onPeriodChange: (value: Period) => void;
}

const getPeriodText = (period: Period, langResources: Language['resources']) => {
  switch (period) {
    case Period.LastWeek:
      return langResources.common.period.lastWeek;

    case Period.LastMonth:
      return langResources.common.period.lastMonth;

    case Period.LastYear:
      return langResources.common.period.lastYear;
  }
};

export const Header = (props: HeaderProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  const handleRadioChange = useCallback((e: RadioChangeEvent) => {
    props.onIsServicesAnalyticsChange(e.target.value);
  }, [props]);

  const handlePeriodChange = useCallback((value: Period) => {
    props.onPeriodChange(value);
  }, [props]);

  const options = Object.keys(Period).map(k => Number(k)).filter(k => !isNaN(k))
    .map(k => <Select.Option key={k} value={k}>{getPeriodText(k, langResources)}</Select.Option>);

  return <div className="analytics-header">
    <h1 className="analytics-header__title">{analyticsLangResources.title}</h1>
    <div className="analytics-header__selector-container">
      <Select className="analytics-header__period" value={props.period} onChange={handlePeriodChange}>
        {options}
      </Select>
      <Radio.Group onChange={handleRadioChange} value={props.isServicesAnalytics}>
        <Radio.Button value={true}>Services</Radio.Button>
        <Radio.Button value={false}>Donations</Radio.Button>
      </Radio.Group>
    </div>
  </div>;
};

export const HeaderPure = React.memo(Header);
