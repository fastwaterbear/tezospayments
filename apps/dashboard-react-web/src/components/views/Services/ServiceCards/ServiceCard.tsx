import { Button, Card } from 'antd';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Service, combineClassNames, text } from '@tezospayments/common';

import { config } from '../../../../config';
import { ExplorerLinkPure } from '../../../common';
import { ActiveTagPure } from '../../../common/Tags';
import { useCurrentLanguageResources } from '../../../hooks';

import './ServiceCard.scss';

interface ServiceCardProps {
  service: Service;
  isUpdating: boolean;
}

export const ServiceCard = (props: ServiceCardProps) => {
  const history = useHistory();
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;

  const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const tagName = (e.target as HTMLElement).tagName.toLowerCase();
    if (tagName !== 'svg' && tagName !== 'a' && tagName !== 'path') {
      history.push(`${config.routers.services}/${props.service.contractAddress}`);
    }
  }, [history, props.service.contractAddress]);

  const logoClassName = combineClassNames(
    'service-card__logo',
    props.service.iconUrl ? 'service-card__logo_image' : 'service-card__logo_text',
  );

  return <Card size="small" bodyStyle={{ padding: 0 }} className="service-card-container" onClick={handleCardClick}>
    <div className="service-card">
      <div className="service-card__info-container">
        <div className="service-card__main-info">
          {props.service.iconUrl
            ? <img className={logoClassName} alt="logo" src={props.service.iconUrl} />
            : <span className={logoClassName}>{text.getAvatarText(props.service.name)}</span>}
          <div className="service-card__name-container">
            <span className="service-card__name" title={props.service.name}>{props.service.name}</span>
            <div className="service-card__tags-container">
              <ActiveTagPure paused={props.service.paused} deleted={props.service.deleted} isUpdating={props.isUpdating} />
            </div>
          </div>
        </div>
        <div className="service-card__link-container">
          <ExplorerLinkPure hash={props.service.contractAddress} className="service-card__link" showCopyButton>
            {props.service.contractAddress}
          </ExplorerLinkPure>
        </div>
      </div>
      <div className="service-card__button-container">
        <Button className="service-card__button" type="primary">{commonLangResources.open}</Button>
      </div>
    </div>
  </Card>;
};

export const ServiceCardPure = React.memo(ServiceCard);
