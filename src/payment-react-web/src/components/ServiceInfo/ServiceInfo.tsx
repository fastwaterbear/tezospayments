import React from 'react';

import { Service } from '@tezos-payments/common/dist/models/blockchain';

import { CopyButtonPure, ExternalLink } from '../common';
import { ServiceIcon } from './ServiceIcon';
import { ServiceLinks } from './ServiceLinks';
import './ServiceInfo.scss';

interface ServiceInfoProps {
  service: Service;
}

export const ServiceInfo = (props: ServiceInfoProps) => {
  return <div className="service-info">
    <ServiceIcon className="service-info__icon" iconUri={props.service.iconUri} serviceName={props.service.name} />
    <h2 className="service-info__name">{props.service.name}</h2>
    <div className="service-info__contract contract-address">
      <span className="contract-address__label">Contract Address</span>
      <div className="contract-address__value">
        <ExternalLink className="contract-address__link" href={`https://better-call.dev/${props.service.contractAddress}`}>
          {props.service.contractAddress}
        </ExternalLink>
        <CopyButtonPure />
      </div>
    </div>
    <ServiceLinks className="service-info__links" links={props.service.links} />
  </div>;
};

export const ServiceInfoPure = React.memo(ServiceInfo);
