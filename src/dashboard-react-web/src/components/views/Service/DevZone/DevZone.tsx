
import { Button, } from 'antd';
import React, { useCallback, useState } from 'react';

import { useCurrentLanguageResources } from '../../../hooks';
import { AddApiKeyModalPure } from './AddApiKeyModal';
import { ApiKeyListPure } from './ApiKeyList';

import './DevZone.scss';

export const DevZone = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const [addKeyModalVisible, setAddKeyModalVisible] = useState(false);
  const handleAddKeyButtonClick = useCallback(() => setAddKeyModalVisible(true), []);
  const handleClosePopupClick = useCallback(() => setAddKeyModalVisible(false), []);

  return <>
    <div className="service-danger-zone__button-container">
      <span className="service-dev-zone__header">{servicesLangResources.devZone.title}</span>
      <Button className="service-button" type="default" onClick={handleAddKeyButtonClick}>
        {servicesLangResources.devZone.addKey}
      </Button>
    </div>
    <ApiKeyListPure />
    <AddApiKeyModalPure visible={addKeyModalVisible} onCancel={handleClosePopupClick} />
  </>;
};

export const DevZonePure = React.memo(DevZone);
