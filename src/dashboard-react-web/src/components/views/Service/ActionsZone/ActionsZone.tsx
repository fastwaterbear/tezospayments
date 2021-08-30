import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Service } from '@tezospayments/common/src';

import { config } from '../../../../config';
import { useCurrentLanguageResources } from '../../../hooks';

import './ActionsZone.scss';

interface ActionsZoneProps {
  service: Service;
}

export const ActionsZone = ({ service }: ActionsZoneProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;
  const history = useHistory();

  const handleAcceptPaymentsClick = useCallback(() => {
    history.push(`${config.routers.acceptPayments}/${service.contractAddress}`);
  }, [history, service.contractAddress]);

  return <div className="service-actions-zone">
    <span className="service-actions-zone__header">Actions</span>

    <div className="service-actions-zone__button-container">
      <p>{servicesLangResources.acceptPaymentsDescription}</p>
      <Button onClick={handleAcceptPaymentsClick} className="service-button" type="primary">{servicesLangResources.acceptPayments}</Button>
    </div>
  </div>;
};

export const ActionsZonePure = React.memo(ActionsZone);
