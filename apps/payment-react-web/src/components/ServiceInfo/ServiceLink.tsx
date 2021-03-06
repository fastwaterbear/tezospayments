import {
  LinkOutlined, FacebookOutlined, TwitterOutlined, InstagramOutlined,
  GithubOutlined, MailOutlined, RedditOutlined
} from '@ant-design/icons';
import React from 'react';

import { IconId, ServiceLinkHelper } from '@tezospayments/common';

import { TelegramIcon } from '../../assets/icons';
import { ExternalLink } from '../common';
import './ServiceLink.scss';

interface ServiceLinkProps {
  link: string;
}

const serviceLinkHelper = new ServiceLinkHelper();

const iconIdMap = {
  [IconId.Common]: LinkOutlined,
  [IconId.Email]: MailOutlined,
  [IconId.Telegram]: TelegramIcon,
  [IconId.Facebook]: FacebookOutlined,
  [IconId.Twitter]: TwitterOutlined,
  [IconId.Instagram]: InstagramOutlined,
  [IconId.GitHub]: GithubOutlined,
  [IconId.Reddit]: RedditOutlined,
};

export const ServiceLink = (props: ServiceLinkProps) => {
  const linkInfo = serviceLinkHelper.getLinkInfo(props.link);
  if (!linkInfo)
    return null;

  const Icon = iconIdMap[linkInfo.icon];

  return <span className="service-link">
    <Icon className="service-link__icon" />
    <ExternalLink className="service-link__link" href={linkInfo.formattedLink}>{linkInfo.displayLink}</ExternalLink>
  </span>;
};

export const ServiceLinkPure = React.memo(ServiceLink);
