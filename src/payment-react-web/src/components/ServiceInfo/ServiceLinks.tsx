import { combineClassNames } from '@tezos-payments/common/dist/utils';

import { ExternalLink } from '../common';
import './ServiceLinks.scss';

interface ServiceLinksProps {
  className?: string;
  links: readonly string[];
}

export const ServiceLinks = (props: ServiceLinksProps) => {
  return <div className={combineClassNames('service-links', props.className)}>
    {props.links.map(link => <ExternalLink
      className="service-link"
      href={link}>{link}</ExternalLink>)
    }
  </div>;
};
