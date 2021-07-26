import { memoize } from '../utils';

export enum IconId {
  Common = 0,
  Email = 1,
  Telegram = 2,
  Facebook = 3,
  Twitter = 4,
  Instagram = 5,
  GitHub = 6,
  Reddit = 7
}

interface LinkInfo {
  readonly rawLink: string;
  readonly formattedLink: string;
  readonly displayLink: string;
  readonly icon: IconId;
}

const getInvalidLinkInfo = (link: string): LinkInfo => ({
  rawLink: link,
  formattedLink: '#',
  displayLink: 'Invalid Link',
  icon: IconId.Common
});

type LinkInfoProvider = (link: string) => LinkInfo | false;

const prepareFormattedLink = memoize((link: string) => link.trim());
const prepareDisplayLink = memoize((link: string) => link.trim().replace(/\/$/, ''));

const socialMediaLinkInfoProvider = (link: string, baseUrl: string, icon: IconId): LinkInfo | false => {
  if (!link.startsWith(baseUrl))
    return false;

  const formattedLink = prepareFormattedLink(link);
  if (formattedLink == baseUrl)
    return false;

  return {
    rawLink: link,
    formattedLink,
    displayLink: prepareDisplayLink(link).replace(baseUrl, ''),
    icon
  };
};

const telegramLinkInfoProvider: LinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://t.me/', IconId.Telegram);
const facebookLinkInfoProvider: LinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://facebook.com/', IconId.Facebook);
const twitterLinkInfoProvider: LinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://twitter.com/', IconId.Twitter);
const instagramLinkInfoProvider: LinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://instagram.com/', IconId.Instagram);
const gitHubLinkInfoProvider: LinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://github.com/', IconId.GitHub);
const redditLinkInfoProvider: LinkInfoProvider = link => socialMediaLinkInfoProvider(link, 'https://www.reddit.com/', IconId.Reddit);

// This regex should not use for email validation
const emailCheckingRegEx = /^[^\s/@]+@[^\s@/]+$/;
const emailLinkInfoProvider: LinkInfoProvider = link => {
  const preparedFormattedLink = prepareFormattedLink(link);

  return emailCheckingRegEx.test(preparedFormattedLink) && {
    rawLink: link,
    formattedLink: `mailto:${preparedFormattedLink}`,
    displayLink: prepareDisplayLink(link),
    icon: IconId.Email
  };
};

const javascriptLinkInfoProvider: LinkInfoProvider = link => link.startsWith('javascript') ? getInvalidLinkInfo(link) : false;

// https://datatracker.ietf.org/doc/html/rfc3986#section-3.1
const urlSchemeRegEx = /^([a-z][a-z0-9+\-.]*):/;
const commonLinkInfoProvider: LinkInfoProvider = link => {
  const formattedLink = prepareFormattedLink(link);

  return urlSchemeRegEx.test(formattedLink) && {
    rawLink: link,
    formattedLink,
    displayLink: prepareDisplayLink(link),
    icon: IconId.Common
  };
};

const editLinkInfoProvider: LinkInfoProvider = link => {
  const formattedLink = prepareFormattedLink(link);

  return {
    rawLink: link,
    formattedLink,
    displayLink: prepareDisplayLink(link),
    icon: IconId.Common
  };
};


export class ServiceLinkHelper {
  // Order is important
  static readonly linkInfoProviders: readonly LinkInfoProvider[] = [
    // Disallowed
    javascriptLinkInfoProvider,
    // Allowed
    telegramLinkInfoProvider,
    facebookLinkInfoProvider,
    twitterLinkInfoProvider,
    instagramLinkInfoProvider,
    gitHubLinkInfoProvider,
    emailLinkInfoProvider,
    redditLinkInfoProvider,
    commonLinkInfoProvider
  ];

  getLinkInfo(link: string, isEditMode = false): LinkInfo | null {
    for (const provider of ServiceLinkHelper.linkInfoProviders) {
      const linkInfo = provider(link);

      if (linkInfo)
        return this.linkInfoIsValid(linkInfo) ? linkInfo : null;
    }

    if (isEditMode)
      return editLinkInfoProvider(link) as LinkInfo;

    return null;
  }

  linkInfoIsValid(linkInfo: LinkInfo) {
    return linkInfo.formattedLink !== '#';
  }
}
