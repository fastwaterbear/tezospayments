import { Skeleton } from 'antd';
import React from 'react';

import { getSortedServices, selectServicesState } from '../../../store/services/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { NewServiceCardPure, ServiceCardPure } from './ServiceCards';
import './Services.scss';

export const Services = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const isInitialized = useAppSelector(selectServicesState).initialized;
  const services = useAppSelector(getSortedServices);
  const servicesCards = services.map(s => <ServiceCardPure
    key={s.contractAddress}
    contractAddress={s.contractAddress}
    isActive={!s.paused}
    logoUrl={s.iconUri}
    name={s.name}
  />);

  return <View title={servicesLangResources.title}>
    <View.Title>{servicesLangResources.title}</View.Title>
    {!isInitialized
      ? <Skeleton active />
      : <div className="services-container">
        {servicesCards}
        <NewServiceCardPure />
      </div>}
  </View >;
};

export const ServicesPure = React.memo(Services);
