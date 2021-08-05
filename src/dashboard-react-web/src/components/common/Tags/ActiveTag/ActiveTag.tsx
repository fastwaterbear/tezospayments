import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import { useCurrentLanguageResources } from '../../../hooks';

import './ActiveTag.scss';

interface ActiveTagProps {
  paused: boolean;
  deleted: boolean;
}

export const ActiveTag = (props: ActiveTagProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  return props.deleted
    ? <Tag icon={<CloseCircleOutlined />} className="tag-active tag-active_deleted">{servicesLangResources.status.deleted}</Tag>
    : props.paused
      ? <Tag icon={<CloseCircleOutlined />} className="tag-active tag-active_paused">{servicesLangResources.status.paused}</Tag>
      : <Tag icon={<CheckCircleOutlined />} className="tag-active tag-active_active">{servicesLangResources.status.active}</Tag>;
};

export const ActiveTagPure = React.memo(ActiveTag);
