import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { config } from '../../../config';
import { useCurrentLanguageResources } from '../../hooks';

import './NoServicesCreated.scss';

export const NoServicesCreated = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;
  const navigate = useNavigate();

  const handleCreateServiceClick = useCallback(() => {
    navigate(config.routers.createService);
  }, [navigate]);

  return <div className="no-services-created">
    <div>
      <p>{servicesLangResources.youDoNotHaveAnyServicesYet}</p>
      <p>{servicesLangResources.createYourFirstService}</p>
      <Button type="primary" onClick={handleCreateServiceClick}>{servicesLangResources.editing.createService}</Button>
    </div>
  </div>;
};

export const NoServicesCreatedPure = React.memo(NoServicesCreated);
