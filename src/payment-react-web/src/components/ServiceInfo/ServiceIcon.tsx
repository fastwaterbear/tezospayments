import { combineClassNames } from '@tezos-payments/common/dist/utils';
import './ServiceIcon.scss';

type ServiceIconProps = {
  className?: string;
  serviceName?: string;
  iconUri?: string;
};

export const ServiceIcon = (props: ServiceIconProps) => {
  const className = combineClassNames('service-icon', props.className);

  return props.iconUri ? <img className={className} src={props.iconUri} alt="Service" draggable="false" />
    : <img className={className} src={props.iconUri} alt="Service" draggable="false" />;
};
