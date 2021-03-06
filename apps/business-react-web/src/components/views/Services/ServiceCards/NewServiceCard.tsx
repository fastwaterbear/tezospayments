import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { config } from '../../../../config';
import { useCurrentLanguageResources } from '../../../hooks';

import './NewServiceCard.scss';

export const NewServiceCard = () => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const servicesLangResources = langResources.views.services;
  const navigate = useNavigate();

  const handleCardClick = useCallback(() => {
    navigate(config.routers.createService);
  }, [navigate]);

  return <Card bodyStyle={{ padding: 0 }} className="new-service-card-container" onClick={handleCardClick}>
    <div className="new-service-card" title={servicesLangResources.createNewService}>
      <div className="new-service-card__info">
        <PlusOutlined className="new-service-card__icon" />
        <span>{commonLangResources.new}</span>
      </div>
    </div>
  </Card>;
};

export const NewServiceCardPure = React.memo(NewServiceCard);
