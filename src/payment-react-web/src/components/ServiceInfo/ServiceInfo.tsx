import React from 'react';

import { Service } from '@tezospayments/common/dist/models/service';

import { BlockchainLinkPure } from '../common';
import { ServiceIcon } from './ServiceIcon';
import { ServiceLinks } from './ServiceLinks';
import './ServiceInfo.scss';

interface ServiceInfoProps {
  service: Service;
  showDescription?: boolean;
}

type DefaultServiceInfoProps = Required<Pick<ServiceInfoProps, 'showDescription'>>;

const defaultProps: DefaultServiceInfoProps = {
  showDescription: true
};

export const ServiceInfo = (props: ServiceInfoProps & DefaultServiceInfoProps) => {
  const contractAddressUrl = `https://better-call.dev/${props.service.network.name}/${props.service.contractAddress}`;

  return <div className="service-info">
    <ServiceIcon className="service-info__icon" iconUri={props.service.iconUri} serviceName={props.service.name} />
    <h2 className="service-info__name">{props.service.name}</h2>
    <div className="service-info__contract contract-address">
      <span className="contract-address__label">Contract Address</span>
      <BlockchainLinkPure className="contract-address__value" href={contractAddressUrl}>
        {props.service.contractAddress}
      </BlockchainLinkPure>
    </div>
    {props.showDescription && !!props.service.description && <div className="service-info__description">
      {props.service.description}
    </div>}
    <ServiceLinks className="service-info__links" links={props.service.links} />
  </div>;
};
ServiceInfo.defaultProps = defaultProps;

export const ServiceInfoPure = React.memo(ServiceInfo);
