import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import { useCurrentLanguageResources } from '../../../hooks';

import './ActiveTag.scss';

interface ActiveTagProps {
  isActive: boolean;
}

export const ActiveTag = (props: ActiveTagProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  return props.isActive
    ? <Tag icon={<CheckCircleOutlined />} className="tag-active_active">{servicesLangResources.status.active}</Tag>
    : <Tag icon={<CloseCircleOutlined />} className="tag-active_not-active">{servicesLangResources.status.paused}</Tag>;
};

export const ActiveTagPure = React.memo(ActiveTag);
