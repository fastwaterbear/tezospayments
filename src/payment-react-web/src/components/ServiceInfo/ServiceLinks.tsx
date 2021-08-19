import { combineClassNames } from '@tezospayments/common';

import { ServiceLink } from './ServiceLink';
import './ServiceLinks.scss';

interface ServiceLinksProps {
  className?: string;
  links: readonly string[];
}

export const ServiceLinks = (props: ServiceLinksProps) => {
  return <div className={combineClassNames('service-links', props.className)}>
    {props.links.map(link => <ServiceLink link={link} key={link} />).filter(Boolean)}
  </div>;
};
