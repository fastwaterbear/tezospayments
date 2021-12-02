import { combineClassNames, text } from '@tezospayments/common';
import './ServiceIcon.scss';

type ServiceIconProps = {
  serviceName: string;
  className?: string;
  iconUrl?: string;
};

export const ServiceIcon = (props: ServiceIconProps) => {
  const className = combineClassNames(
    'service-icon',
    props.iconUrl ? 'service-icon_type-image' : 'service-icon_type-text',
    props.className
  );

  return props.iconUrl ? <img className={className} src={props.iconUrl} alt="Service" draggable="false" />
    : <span className={className}>{text.getAvatarText(props.serviceName)}</span>;
};
