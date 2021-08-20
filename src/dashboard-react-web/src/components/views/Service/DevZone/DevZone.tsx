
import { Button } from 'antd';
import React from 'react';

import { useCurrentLanguageResources } from '../../../hooks';
import { ApiKeyListPure } from './ApiKeyList';

import './DevZone.scss';

export const DevZone = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  return <>
    <div className="service-danger-zone__button-container">
      <span className="service-dev-zone__header">{servicesLangResources.devZone.title}</span>
      <Button className="service-button" type="default" >
        {servicesLangResources.devZone.addKey}
      </Button>
    </div>
    <ApiKeyListPure />
  </>;
};

export const DevZonePure = React.memo(DevZone);
