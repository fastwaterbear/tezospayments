import React from 'react';

import { ServiceLinkHelper } from '@tezospayments/common/dist/helpers';


import { ExternalLink } from '../../common';
import './ServiceLink.scss';
import { iconIdMap } from './iconIdMap';

interface ServiceLinkProps {
  link: string;
}

const serviceLinkHelper = new ServiceLinkHelper();

export const ServiceLink = (props: ServiceLinkProps) => {
  const linkInfo = serviceLinkHelper.getLinkInfo(props.link);
  if (!linkInfo)
    return null;

  const Icon = iconIdMap[linkInfo.icon];

  return <span className="service-link">
    <Icon className="service-link__icon" />
    <ExternalLink className="service-link__link" href={linkInfo.formattedLink}>{linkInfo.displayLink}</ExternalLink>
  </span>;
};

export const ServiceLinkPure = React.memo(ServiceLink);
