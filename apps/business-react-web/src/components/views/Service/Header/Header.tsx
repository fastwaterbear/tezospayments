import { EditFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Service, ServiceOperationType, combineClassNames, text } from '@tezospayments/common';

import { config } from '../../../../config';
import { ExplorerLinkPure } from '../../../common';
import { ActiveTagPure, CustomTagPure } from '../../../common/Tags';
import { useCurrentLanguageResources } from '../../../hooks';

import './Header.scss';

interface HeaderProps {
  service: Service;
  isUpdating: boolean;
  readOnly: boolean;
}

export const Header = ({ service, isUpdating, readOnly }: HeaderProps) => {
  const navigate = useNavigate();
  const langResources = useCurrentLanguageResources();
  const servicesLangResources = langResources.views.services;

  const logoClassName = combineClassNames(
    'service__logo',
    service?.iconUrl ? 'service__logo_image' : 'service__logo_text',
  );

  const arePaymentsAllowed = service?.allowedOperationType === ServiceOperationType.Payment || service?.allowedOperationType === ServiceOperationType.All;
  const areDonationsAllowed = service?.allowedOperationType === ServiceOperationType.Donation || service?.allowedOperationType === ServiceOperationType.All;

  const handleEditClick = useCallback(() => {
    navigate(config.routers.service(service.contractAddress, true));
  }, [navigate, service.contractAddress]);

  return <div className="service-header">
    <div className="service-header__logo-container">
      {service.iconUrl
        ? <img className={logoClassName} alt="logo" src={service.iconUrl} />
        : <span className={logoClassName}>{text.getAvatarText(service.name)}</span>}
      <div className="service-header__main-info">
        <h1>{service.name}</h1>
        <ExplorerLinkPure hash={service.contractAddress} className="service__link" showCopyButton>
          {service.contractAddress}
        </ExplorerLinkPure>
        <div className="service-header__tags-container">
          <ActiveTagPure paused={service.paused} deleted={service.deleted} isUpdating={isUpdating} />
          {arePaymentsAllowed && <CustomTagPure text={servicesLangResources.operations.paymentsEnabled} />}
          {areDonationsAllowed && <CustomTagPure text={servicesLangResources.operations.donationsEnabled} />}
        </div>
      </div>
    </div>
    <Button disabled={readOnly} className="service-button" icon={<EditFilled />} type="primary" onClick={handleEditClick}>{servicesLangResources.editing.editService}</Button>
  </div>;
};

export const HeaderPure = React.memo(Header);
