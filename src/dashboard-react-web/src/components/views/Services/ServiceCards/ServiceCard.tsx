import { Button, Card } from 'antd';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { combineClassNames, text } from '@tezospayments/common/dist/utils';


import { config } from '../../../../config';
import { ExplorerLinkPure } from '../../../common';
import { ActiveTagPure } from '../../../common/Tags';
import { useCurrentLanguageResources } from '../../../hooks';

import './ServiceCard.scss';

interface ServiceCardProps {
  name: string;
  isActive: boolean;
  contractAddress: string;
  logoUrl?: string;
}

export const ServiceCard = (props: ServiceCardProps) => {
  const history = useHistory();
  const langResources = useCurrentLanguageResources();
  const commonLangResources = langResources.common;

  const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const tagName = (e.target as HTMLElement).tagName.toLowerCase();
    if (tagName !== 'svg' && tagName !== 'a' && tagName !== 'path') {
      history.push(`${config.routers.services}/${props.contractAddress}`);
    }
  }, [history, props.contractAddress]);

  const logoClassName = combineClassNames(
    'service-card__logo',
    props.logoUrl ? 'service-card__logo_image' : 'service-card__logo_text',
  );

  return <Card size="small" bodyStyle={{ padding: 0 }} className="service-card-container" onClick={handleCardClick}>
    <div className="service-card">
      <div className="service-card__info-container">
        <div className="service-card__main-info">
          {props.logoUrl
            ? <img className={logoClassName} alt="logo" src={props.logoUrl} />
            : <span className={logoClassName}>{text.getAvatarText(props.name)}</span>}
          <div className="service-card__name-container">
            <span className="service-card__name" title={props.name}>{props.name}</span>
            <div className="service-card__tags-container">
              <ActiveTagPure isActive={props.isActive} />
            </div>
          </div>
        </div>
        <div className="service-card__link-container">
          <ExplorerLinkPure hash={props.contractAddress} className="service-card__link" showCopyButton>
            {props.contractAddress}
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
