import { Button, Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { selectServicesState } from '../../../store/services/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { Header } from './Header';
import { Tokens } from './Tokens';

import './Service.scss';

export const Service = () => {
  const { address } = useParams<{ address: string }>();
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  //TODO: Use Map
  const { services, initialized: isInitialized } = useAppSelector(selectServicesState);
  const service = services.filter(s => s.contractAddress === address)[0];

  const title = isInitialized ? service?.name : address;

  return <View title={title} className="service-container">
    {!isInitialized || !service
      ? <Skeleton active />
      : <>
        <Header service={service} />
        <div className="service-view-zone">
          <p className="service-view-zone__description">{service.description}</p>
          <div className="service-view-zone__lists-container">
            <div className="service-view-zone__list-container">
              <span className="service-view-zone__list-header">{servicesLangResources.allowedCurrencies}</span>
              <Tokens service={service} />
            </div>
            <div className="service-view-zone__list-container">
              <span className="service-view-zone__list-header">{servicesLangResources.links}</span>
            </div>
          </div>
          <div className="service-view-zone__button-container">
            <p>{servicesLangResources.acceptPaymentsDescription}</p>
            <Button className="service-button" type="primary">{servicesLangResources.acceptPayments}</Button>
          </div>
        </div>
      </>}
  </View>;
};

export const ServicePure = React.memo(Service);
