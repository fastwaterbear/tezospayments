import React, { useContext } from 'react';

import { Service } from '@tezospayments/common';

import { AppViewContext } from '../../app';
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
  const appContext = useContext(AppViewContext);
  const urlExplorer = (props.service.network.name !== 'edo2net') ? appContext.betterCallDevBlockchainUrlExplorer : appContext.tzStatsUrlBlockchainExplorer;
  const contractUrl = urlExplorer.getContractUrl(props.service.contractAddress);

  return <div className="service-info">
    <ServiceIcon className="service-info__icon" iconUrl={props.service.iconUrl} serviceName={props.service.name} />
    <h2 className="service-info__name">{props.service.name}</h2>
    <div className="service-info__contract contract-address">
      <span className="contract-address__label">Contract Address</span>
      <BlockchainLinkPure className="contract-address__value" href={contractUrl}>
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
