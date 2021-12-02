import { Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { emptyService, Service as ServiceInterface, combineClassNames } from '@tezospayments/common';

import { getOperationsByService, selectServicesState } from '../../../store/services/selectors';
import { useAppSelector, useQuery } from '../../hooks';
import { View } from '../View';
import { ActionsZonePure } from './ActionsZone';
import { DangerZonePure } from './DangerZone';
import { DevZonePure } from './DevZone';
import { HeaderPure } from './Header';
import { ServiceEditFormPure } from './ServiceEditForm';
import { ViewZonePure } from './ViewZone';

import './Service.scss';

export enum ServiceViewMode {
  ViewAndEdit, Create
}

interface ServiceProps {
  mode: ServiceViewMode,
}

export const Service = (props: ServiceProps) => {
  const query = useQuery();
  const isEdit = !!query.get('edit');
  const { address } = useParams<{ address: string }>();
  const { services, initialized: isInitialized } = useAppSelector(selectServicesState);
  const pendingOperations = useAppSelector(getOperationsByService);
  const isUpdating = pendingOperations.has(address);
  const readOnly = !!pendingOperations.size;
  const isCreateMode = props.mode === ServiceViewMode.Create;

  //TODO: Use Map
  const service = isCreateMode ? { ...emptyService } as ServiceInterface : services.filter(s => s.contractAddress === address)[0];

  const title = isInitialized && service ? service.name : address;
  const className = combineClassNames('service-container', isEdit || isCreateMode ? 'service-container_edit' : 'service-container_view');

  return <View title={title} className={className}>
    {!isInitialized || !service
      ? <Skeleton active />
      : isEdit || isCreateMode
        ? <ServiceEditFormPure service={service} isCreateMode={isCreateMode} readOnly={readOnly} />
        : <>
          <HeaderPure service={service} isUpdating={isUpdating} readOnly={readOnly} />
          <ViewZonePure service={service} />
          <ActionsZonePure service={service} readOnly={isUpdating || service.deleted} />
          <DevZonePure service={service} readOnly={readOnly} />
          <DangerZonePure service={service} readOnly={readOnly} />
        </>}
  </View>;
};

export const ServicePure = React.memo(Service);
