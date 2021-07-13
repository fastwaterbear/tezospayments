import { Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { selectServicesState } from '../../../store/services/selectors';
import { useAppSelector } from '../../hooks';
import { View } from '../View';
import { Header } from './Header';
import { ViewZone } from './ViewZone';

import './Service.scss';

export const Service = () => {
  const { address } = useParams<{ address: string }>();

  //TODO: Use Map
  const { services, initialized: isInitialized } = useAppSelector(selectServicesState);
  const service = services.filter(s => s.contractAddress === address)[0];

  const title = isInitialized && service ? service.name : address;

  return <View title={title} className="service-container">
    {!isInitialized || !service
      ? <Skeleton active />
      : <>
        <Header service={service} />
        <ViewZone service={service} />
      </>}
  </View>;
};

export const ServicePure = React.memo(Service);
