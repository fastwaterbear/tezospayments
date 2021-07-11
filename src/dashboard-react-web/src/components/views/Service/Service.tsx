import { Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { combineClassNames, text } from '@tezos-payments/common/dist/utils';

import { selectServicesState } from '../../../store/services/selectors';
import { ExplorerLink } from '../../common';
import { useAppSelector } from '../../hooks';
import { View } from '../View';

import './Service.scss';

export const Service = () => {
  const { address } = useParams<{ address: string }>();

  //TODO: Use Map
  const { services, initialized: isInitialized } = useAppSelector(selectServicesState);
  const service = services.filter(s => s.contractAddress === address)[0];

  const title = isInitialized ? service?.name : address;

  const logoClassName = combineClassNames(
    'service__logo',
    service?.iconUri ? 'service__logo_image' : 'service__logo_text',
  );

  return <View title={title} className="service-container">
    {!isInitialized || !service
      ? <Skeleton active />
      : <div className="service">
        <div className="service__header">
          {service.iconUri
            ? <img className={logoClassName} alt="logo" src={service.iconUri} />
            : <span className={logoClassName}>{text.getAvatarText(service.name)}</span>}
          <h1>{title}</h1>
          <ExplorerLink hash={service.contractAddress} className="service__link" showCopyButton>
            {service.contractAddress}
          </ExplorerLink>
        </div>
      </div>}
  </View>;
};

export const ServicePure = React.memo(Service);
