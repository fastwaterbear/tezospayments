
import { Button, } from 'antd';
import React, { useCallback, useState } from 'react';

import { Service } from '@tezospayments/common';

import { useCurrentLanguageResources } from '../../../hooks';
import { AddApiKeyModalPure } from './AddApiKeyModal';
import { ApiKeyListPure } from './ApiKeyList';

import './DevZone.scss';

interface DevZoneProps {
  service: Service;
  readOnly: boolean;
}

export const DevZone = (props: DevZoneProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const [addKeyModalVisible, setAddKeyModalVisible] = useState(false);
  const handleAddKeyButtonClick = useCallback(() => setAddKeyModalVisible(true), []);
  const handleClosePopupClick = useCallback(() => setAddKeyModalVisible(false), []);

  return <>
    <div className="service-dev-zone__button-container">
      <span className="service-dev-zone__header">{servicesLangResources.devZone.title}</span>
      <Button disabled={props.readOnly} className="service-button" type="default" onClick={handleAddKeyButtonClick}>
        {servicesLangResources.devZone.addKey}
      </Button>
    </div>
    <ApiKeyListPure service={props.service} readOnly={props.readOnly} />
    <AddApiKeyModalPure service={props.service} visible={addKeyModalVisible} onCancel={handleClosePopupClick} />
  </>;
};

export const DevZonePure = React.memo(DevZone);
