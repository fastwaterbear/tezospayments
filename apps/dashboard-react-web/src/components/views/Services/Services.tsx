import { Skeleton } from 'antd';
import React from 'react';

import { getOperationsByService, getSortedServices, selectServicesState } from '../../../store/services/selectors';
import { NoServicesCreatedPure } from '../../common/NoServicesCreated';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import { NewServiceCardPure, ServiceCardPure } from './ServiceCards';
import './Services.scss';

export const Services = () => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const servicesState = useAppSelector(selectServicesState);
  const pendingOperations = useAppSelector(getOperationsByService);

  const services = useAppSelector(getSortedServices);
  const servicesCards = services.map(s => <ServiceCardPure
    key={s.contractAddress}
    service={s}
    isUpdating={pendingOperations.has(s.contractAddress)}
  />);

  return <View title={servicesLangResources.title}>
    <View.Title>{servicesLangResources.title}</View.Title>
    {!servicesState.initialized
      ? <Skeleton active />
      : !servicesState.services.length
        ? <NoServicesCreatedPure />
        : <div className="services-container">
          {servicesCards}
          <NewServiceCardPure />
        </div>}
  </View >;
};

export const ServicesPure = React.memo(Services);