import { Button } from 'antd';
import React from 'react';

import { useCurrentLanguageResources } from '../../../hooks';

import './DangerZone.scss';

export const DangerZone = () => {
  const langResources = useCurrentLanguageResources();
  const dangerZoneLangResources = langResources.views.services.dangerZone;

  return <div className="service-danger-zone">
    <span className="service-danger-zone__header">{dangerZoneLangResources.title}</span>
    <div className="service-danger-zone__button-container">
      <p>{dangerZoneLangResources.pauseServiceDescription}</p>
      <Button className="service-button" type="default">{dangerZoneLangResources.pauseService}</Button>
    </div>
    <hr className="service-danger-zone__divider" />
    <div className="service-danger-zone__button-container">
      <p>{dangerZoneLangResources.deleteServiceDescription}</p>
      <Button className="service-button" type="primary" danger>{dangerZoneLangResources.deleteService}</Button>
    </div>
  </div>;
};

export const DangerZonePure = React.memo(DangerZone);
