import { Button } from 'antd';
import React from 'react';

import { Service } from '@tezospayments/common/dist/models/service';


import { ServiceLinks } from '../../../common/ServiceLinks';
import { useCurrentLanguageResources } from '../../../hooks';
import { TokensPure } from '../Tokens';

import './ViewZone.scss';

interface ViewZoneProps {
  service: Service;
}

export const ViewZone = ({ service }: ViewZoneProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  return <div className="service-view-zone">
    <p className="service-view-zone__description">{service.description}</p>
    <div className="service-view-zone__lists-container">
      <div className="service-view-zone__list-container">
        <span className="service-view-zone__list-header">{servicesLangResources.allowedCurrencies}</span>
        <TokensPure service={service} />
      </div>
      <div className="service-view-zone__list-container">
        <span className="service-view-zone__list-header">{servicesLangResources.links}</span>
        <ServiceLinks className="service-info__links" links={service.links} />
      </div>
    </div>
    <div className="service-view-zone__button-container">
      <p>{servicesLangResources.acceptPaymentsDescription}</p>
      <Button className="service-button" type="primary">{servicesLangResources.acceptPayments}</Button>
    </div>
  </div>;
};

export const ViewZonePure = React.memo(ViewZone);
