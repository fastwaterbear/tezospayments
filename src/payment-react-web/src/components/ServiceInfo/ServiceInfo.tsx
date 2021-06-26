import React from 'react';

import { Service } from '@tezos-payments/common/dist/models/service';

import { CopyButtonPure, ExternalLink } from '../common';
import { ServiceIcon } from './ServiceIcon';
import { ServiceLinks } from './ServiceLinks';
import './ServiceInfo.scss';

interface ServiceInfoProps {
  service: Service;
}

export const ServiceInfo = (props: ServiceInfoProps) => {
  const contractAddressUrl = `https://better-call.dev/${props.service.network.name}/${props.service.contractAddress}`;

  return <div className="service-info">
    <ServiceIcon className="service-info__icon" iconUri={props.service.iconUri} serviceName={props.service.name} />
    <h2 className="service-info__name">{props.service.name}</h2>
    <div className="service-info__contract contract-address">
      <span className="contract-address__label">Contract Address</span>
      <div className="contract-address__value">
        <ExternalLink className="contract-address__link" href={contractAddressUrl}>
          {props.service.contractAddress}
        </ExternalLink>
        <CopyButtonPure />
      </div>
    </div>
    <ServiceLinks className="service-info__links" links={props.service.links} />
  </div>;
};

export const ServiceInfoPure = React.memo(ServiceInfo);
