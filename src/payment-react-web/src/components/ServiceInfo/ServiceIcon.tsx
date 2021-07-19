import { combineClassNames, text } from '@tezospayments/common/dist/utils';
import './ServiceIcon.scss';

type ServiceIconProps = {
  serviceName: string;
  className?: string;
  iconUri?: string;
};

export const ServiceIcon = (props: ServiceIconProps) => {
  const className = combineClassNames(
    'service-icon',
    props.iconUri ? 'service-icon_type-image' : 'service-icon_type-text',
    props.className
  );

  return props.iconUri ? <img className={className} src={props.iconUri} alt="Service" draggable="false" />
    : <span className={className}>{text.getAvatarText(props.serviceName)}</span>;
};
