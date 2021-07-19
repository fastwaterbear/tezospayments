import { Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { combineClassNames } from '@tezospayments/common/dist/utils';

import { selectServicesState } from '../../../store/services/selectors';
import { useAppSelector, useQuery } from '../../hooks';
import { View } from '../View';
import { DangerZonePure } from './DangerZone';
import { HeaderPure, UpdateServiceHeaderPure } from './Header';
import { UpdateServicePure } from './UpdateService';
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
  const className = combineClassNames('service-container', isEdit ? 'service-container_edit' : 'service-container_view');

  return <View title={title} className={className}>
    {!isInitialized || !service
      ? <Skeleton active />
      : isEdit
        ? <>
          <UpdateServiceHeaderPure />
          <UpdateServicePure service={service} />
        </>
        : <>
          <HeaderPure service={service} />
          <ViewZonePure service={service} />
          <DangerZonePure />
        </>}
  </View>;
};

export const ServicePure = React.memo(Service);
