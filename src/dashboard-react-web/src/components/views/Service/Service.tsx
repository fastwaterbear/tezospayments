import { Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { selectServicesState } from '../../../store/services/selectors';
import { useAppSelector, useQuery } from '../../hooks';
import { View } from '../View';
import { DangerZonePure } from './DangerZone';
import { HeaderPure, UpdateServiceHeaderPure } from './Header';
import { ViewZonePure } from './ViewZone';

import './Service.scss';

export const Service = () => {
  const query = useQuery();
  const isEdit = !!query.get('edit');
  const { address } = useParams<{ address: string }>();
  //TODO: Use Map
  const { services, initialized: isInitialized } = useAppSelector(selectServicesState);
  const service = services.filter(s => s.contractAddress === address)[0];

  const title = isInitialized && service ? service.name : address;

  return <View title={title} className="service-container">
    {!isInitialized || !service
      ? <Skeleton active />
      : isEdit
        ? <>
          <UpdateServiceHeaderPure />
        </>
        : <>
          <HeaderPure service={service} />
          <ViewZonePure service={service} />
          <DangerZonePure />
        </>}
  </View>;
};

export const ServicePure = React.memo(Service);
