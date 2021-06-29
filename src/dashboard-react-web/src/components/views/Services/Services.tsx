import React from 'react';

import { getSortedServices } from '../../../store/services/selectors';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { ServiceCard } from './ServiceCard';
import './Services.scss';

export const Services = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const services = useAppSelector(getSortedServices);
  const servicesCards = services.map(s => <ServiceCard
    key={s.contractAddress}
    contractAddress={s.contractAddress}
    isActive={!s.paused}
    logoUrl={s.iconUri}
    name={s.name}
  />);

  return <View title={servicesLangResources.title}>
    <View.Title>{servicesLangResources.title}</View.Title>
    <div className="services-container">
      {servicesCards}
    </div>
  </View >;
};

export const ServicesPure = React.memo(Services);
