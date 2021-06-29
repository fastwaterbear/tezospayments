import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';

import { useCurrentLanguageResources } from '../../../hooks';

import './NewServiceCard.scss';

export const NewServiceCard = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  return <Card bodyStyle={{ padding: 0 }} className="new-service-card-container">
    <div className="new-service-card" title={servicesLangResources.createNewService}>
      <div className="new-service-card__info">
        <PlusOutlined />
        <span>New</span>
      </div>
    </div>
  </Card>;
};

export const NewServiceCardPure = React.memo(NewServiceCard);
