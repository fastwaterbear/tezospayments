import { Radio, RadioChangeEvent, Select } from 'antd';
import React, { useCallback } from 'react';

import { AnalyticsView, Language, Period } from '../../../../models/system';
import { useCurrentLanguageResources } from '../../../hooks';

import './Header.scss';

interface HeaderProps {
  view: AnalyticsView;
  onViewChange: (value: AnalyticsView) => void;
  period: Period;
  onPeriodChange: (value: Period) => void;
}

const getViewText = (view: AnalyticsView, langResources: Language['resources']) => {
  switch (view) {
    case AnalyticsView.Services:
      return langResources.views.analytics.view.services;
    case AnalyticsView.Donations:
      return langResources.views.analytics.view.donations;
    default:
      throw new Error(`Unsupported view type: ${view}`);
  }
};

const getPeriodText = (period: Period, langResources: Language['resources']) => {
  switch (period) {
    case Period.All:
      return langResources.common.period.allTime;
    case Period.LastWeek:
      return langResources.common.period.lastWeek;
    case Period.LastMonth:
      return langResources.common.period.lastMonth;
    case Period.LastYear:
      return langResources.common.period.lastYear;
    default:
      throw new Error(`Unsupported period type: ${period}`);
  }
};

const periodOptionsValues = Object.keys(Period).map(k => Number(k)).filter(k => !isNaN(k));
const viewOptionsValues = Object.keys(AnalyticsView).map(k => Number(k)).filter(k => !isNaN(k));

export const Header = (props: HeaderProps) => {
  const langResources = useCurrentLanguageResources();
  const analyticsLangResources = langResources.views.analytics;

  const handleViewChange = useCallback((e: RadioChangeEvent) => {
    props.onViewChange(e.target.value);
  }, [props]);

  const handlePeriodChange = useCallback((value: Period) => {
    props.onPeriodChange(value);
  }, [props]);

  const periodOptions = periodOptionsValues
    .map(k => <Select.Option key={k} value={k}>{getPeriodText(k, langResources)}</Select.Option>);

  const viewOptions = viewOptionsValues
    .map(k => <Radio.Button key={k} value={k}>{getViewText(k, langResources)}</Radio.Button>);

  return <div className="analytics-header">
    <h1 className="analytics-header__title">{analyticsLangResources.title}</h1>
    <div className="analytics-header__selector-container">
      <Select className="analytics-header__period" value={props.period} onChange={handlePeriodChange}>
        {periodOptions}
      </Select>
      <Radio.Group value={props.view} onChange={handleViewChange} >
        {viewOptions}
      </Radio.Group>
    </div>
  </div>;
};

export const HeaderPure = React.memo(Header);
