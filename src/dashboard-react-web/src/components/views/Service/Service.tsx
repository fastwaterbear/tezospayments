import { EditFilled } from '@ant-design/icons';
import { Button, Skeleton } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { ServiceOperationType } from '@tezos-payments/common/dist/models/service';
import { combineClassNames, text } from '@tezos-payments/common/dist/utils';

import { selectServicesState } from '../../../store/services/selectors';
import { ExplorerLinkPure } from '../../common';
import { ActiveTagPure, CustomTagPure } from '../../common/Tags';
import { useAppSelector, useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';

import './Service.scss';

export const Service = () => {
  const { address } = useParams<{ address: string }>();
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  //TODO: Use Map
  const { services, initialized: isInitialized } = useAppSelector(selectServicesState);
  const service = services.filter(s => s.contractAddress === address)[0];

  const title = isInitialized ? service?.name : address;

  const logoClassName = combineClassNames(
    'service__logo',
    service?.iconUri ? 'service__logo_image' : 'service__logo_text',
  );

  const arePaymentsAllowed = service?.allowedOperationType === ServiceOperationType.Payment || service?.allowedOperationType === ServiceOperationType.All;
  const areDonationsAllowed = service?.allowedOperationType === ServiceOperationType.Donation || service?.allowedOperationType === ServiceOperationType.All;

  return <View title={title} className="service-container">
    {!isInitialized || !service
      ? <Skeleton active />
      : <div className="service-header">
        <div className="service-header__logo-container">
          {service.iconUri
            ? <img className={logoClassName} alt="logo" src={service.iconUri} />
            : <span className={logoClassName}>{text.getAvatarText(service.name)}</span>}
          <div className="service-header__main-info">
            <h1>{title}</h1>
            <ExplorerLinkPure hash={service.contractAddress} className="service__link" showCopyButton>
              {service.contractAddress}
            </ExplorerLinkPure>
            <div className="service-header__tags-container">
              <ActiveTagPure isActive={!service.paused} />
              {arePaymentsAllowed && <CustomTagPure text={servicesLangResources.operations.paymentsEnabled} />}
              {areDonationsAllowed && <CustomTagPure text={servicesLangResources.operations.donationsEnabled} />}
            </div>
          </div>
        </div>
        <Button className="service-button" icon={<EditFilled />} type="primary">Edit Service</Button>
      </div>}
  </View>;
};

export const ServicePure = React.memo(Service);
