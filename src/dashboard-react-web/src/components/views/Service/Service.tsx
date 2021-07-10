import { Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { selectServicesState } from '../../../store/services/selectors';
import { useAppSelector } from '../../hooks';
import { View } from '../View';

export const Service = () => {
  const { address } = useParams<{ address: string }>();

  //TODO: Use Map
  const { services, initialized: isInitialized } = useAppSelector(selectServicesState);
  const service = services.filter(s => s.contractAddress === address)[0];

  const title = isInitialized ? service?.name : address;

  return <View title={title}>
    <View.Title>{title}</View.Title>
    {!isInitialized
      ? <Skeleton active />
      : <div>Content</div>}
  </View>;
};

export const ServicePure = React.memo(Service);
