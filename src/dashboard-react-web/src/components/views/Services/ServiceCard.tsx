import { CheckCircleOutlined, CloseCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { Button, Card, Tag } from 'antd';
import React from 'react';

import { config } from '../../../config';
import { useCurrentLanguageResources } from '../../hooks';

import './ServiceCard.scss';

interface ServiceCardProps {
  name: string;
  isActive: boolean;
  contractAddress: string;
  logoUrl?: string;
}

export const ServiceCard = (props: ServiceCardProps) => {
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;
  const servicesLangResources = langResources.views.services;

  return <Card size="small" bodyStyle={{ padding: 0 }}>
    <div className="service-card">
      <div className="service-card__info-container">
        <div className="service-card__main-info">
          <img className="service-card__logo" alt="logo" src={props.logoUrl} />
          <div className="service-card__name-container">
            <span className="service-card__name" title={props.name}>{props.name}</span>
            <div className="service-card__tags-container">
              {props.isActive
                ? <Tag icon={<CheckCircleOutlined />} className="service-card__tag-active_active">{servicesLangResources.status.active}</Tag>
                : <Tag icon={<CloseCircleOutlined />} className="service-card__tag-active_not-active">{servicesLangResources.status.paused}</Tag>}
            </div>
          </div>
        </div>
        <div className="service-card__link-container">
          <a href={`${config.links.tzStats}/${props.contractAddress}`} target="_blank" rel="noreferrer" className="service-card__link">
            {props.contractAddress}
          </a>
          <CopyOutlined className="service-card_copy-icon" title={commonLangResources.copy} />
        </div>
      </div>
      <div className="service-card__button-container">
        <Button className="service-card__button" type="primary">{commonLangResources.open}</Button>
      </div>
    </div>
  </Card>;
};

export const ServiceCardPure = React.memo(ServiceCard);
