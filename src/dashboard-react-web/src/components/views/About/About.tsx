import { GlobalOutlined, GithubFilled, TwitterCircleFilled, RedditCircleFilled } from '@ant-design/icons';
import React from 'react';

import { TelegramIcon } from '../../../assets/icons';
import { config } from '../../../config';
import { ExternalLink } from '../../common';
import { useCurrentLanguageResources } from '../../hooks';
import { View } from '../View';
import './About.scss';

export const About = () => {
  const langResources = useCurrentLanguageResources();
  const aboutLangResources = langResources.views.about;

  return <View title={aboutLangResources.title} className="about-view">
    <View.Title className="about-view__title">{aboutLangResources.detailedTitle}</View.Title>
    <div className="about-view__version-info">
      <ExternalLink href={config.app.version.link}>
        {config.app.version.name}
      </ExternalLink>
      &nbsp;{aboutLangResources.build}&nbsp;
      <ExternalLink href={config.app.buildInfo.link}>
        {config.app.buildInfo.commitShortSha}
      </ExternalLink>
    </div>
    <div className="about-view__links">
      <ExternalLink className="about-link" href={config.links.tezosPayments.webSite}>
        <GlobalOutlined className="about-link__icon" />
      </ExternalLink>
      <ExternalLink className="about-link" href={config.links.tezosPayments.gitHub}>
        <GithubFilled className="about-link__icon" />
      </ExternalLink>
      <ExternalLink className="about-link" href={config.links.tezosPayments.telegram}>
        <TelegramIcon className="about-link__icon" />
      </ExternalLink>
      <ExternalLink className="about-link" href={config.links.tezosPayments.twitter}>
        <TwitterCircleFilled className="about-link__icon" />
      </ExternalLink>
      <ExternalLink className="about-link" href={config.links.tezosPayments.reddit}>
        <RedditCircleFilled className="about-link__icon" />
      </ExternalLink>
    </div>
  </View>;
};

export const AboutPure = React.memo(About);
