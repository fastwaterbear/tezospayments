import { EditFilled } from '@ant-design/icons';
import { Button } from 'antd';

import { Service, ServiceOperationType } from '@tezos-payments/common/dist/models/service';
import { combineClassNames, text } from '@tezos-payments/common/dist/utils';

import { ExplorerLinkPure } from '../../common';
import { ActiveTagPure, CustomTagPure } from '../../common/Tags';
import { useCurrentLanguageResources } from '../../hooks';

interface HeaderProps {
  service: Service;
}

export const Header = ({ service }: HeaderProps) => {
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const logoClassName = combineClassNames(
    'service__logo',
    service?.iconUri ? 'service__logo_image' : 'service__logo_text',
  );

  const arePaymentsAllowed = service?.allowedOperationType === ServiceOperationType.Payment || service?.allowedOperationType === ServiceOperationType.All;
  const areDonationsAllowed = service?.allowedOperationType === ServiceOperationType.Donation || service?.allowedOperationType === ServiceOperationType.All;

  return <div className="service-header">
    <div className="service-header__logo-container">
      {service.iconUri
        ? <img className={logoClassName} alt="logo" src={service.iconUri} />
        : <span className={logoClassName}>{text.getAvatarText(service.name)}</span>}
      <div className="service-header__main-info">
        <h1>{service.name}</h1>
        <ExplorerLinkPure hash={service.contractAddress} className="service__link" showCopyButton>
          {service.contractAddress}
        </ExplorerLinkPure>
        <div className="service-header__tags-container">
          <ActiveTagPure isActive={!service.paused} />
          {arePaymentsAllowed && <CustomTagPure text={servicesLangResources.operations.paymentsEnabled} />}
          {areDonationsAllowed && <CustomTagPure text={servicesLangResources.operations.donationsEnabled} />}
        </div>
      </div>
    </div>
    <Button className="service-button" icon={<EditFilled />} type="primary">{servicesLangResources.editService}</Button>
  </div>;
};
