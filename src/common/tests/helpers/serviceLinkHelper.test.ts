import { IconId, ServiceLinkHelper } from '../../src/helpers';

type LinkInfo = ReturnType<ServiceLinkHelper['getLinkInfo']>;

describe('Service Link Helper', () => {
  let serviceLinkHelper: ServiceLinkHelper;

  beforeEach(() => {
    serviceLinkHelper = new ServiceLinkHelper();
  });

  const validLinkTestCases: ReadonlyArray<readonly [link: string, expectedLinkInfo: LinkInfo]> = [
    ['https://tezospayments.com', {
      rawLink: 'https://tezospayments.com',
      formattedLink: 'https://tezospayments.com',
      displayLink: 'https://tezospayments.com',
      icon: IconId.Common
    }],
    ['https://test.org/org/test-org', {
      rawLink: 'https://test.org/org/test-org',
      formattedLink: 'https://test.org/org/test-org',
      displayLink: 'https://test.org/org/test-org',
      icon: IconId.Common
    }],
    ['    https://tezospayments.com           ', {
      rawLink: '    https://tezospayments.com           ',
      formattedLink: 'https://tezospayments.com',
      displayLink: 'https://tezospayments.com',
      icon: IconId.Common
    }],
    ['https://tezospayments.com/', {
      rawLink: 'https://tezospayments.com/',
      formattedLink: 'https://tezospayments.com/',
      displayLink: 'https://tezospayments.com',
      icon: IconId.Common
    }],
    ['https://t.me/tezospayments/', {
      rawLink: 'https://t.me/tezospayments/',
      formattedLink: 'https://t.me/tezospayments/',
      displayLink: 'tezospayments',
      icon: IconId.Telegram
    }],
    ['https://t.me/', {
      rawLink: 'https://t.me/',
      formattedLink: 'https://t.me/',
      displayLink: 'https://t.me',
      icon: IconId.Common
    }],
    ['https://facebook.com/tezospayments', {
      rawLink: 'https://facebook.com/tezospayments',
      formattedLink: 'https://facebook.com/tezospayments',
      displayLink: 'tezospayments',
      icon: IconId.Facebook
    }],
    ['https://facebook.com', {
      rawLink: 'https://facebook.com',
      formattedLink: 'https://facebook.com',
      displayLink: 'https://facebook.com',
      icon: IconId.Common
    }],
    ['https://twitter.com/tezospayments/', {
      rawLink: 'https://twitter.com/tezospayments/',
      formattedLink: 'https://twitter.com/tezospayments/',
      displayLink: 'tezospayments',
      icon: IconId.Twitter
    }],
    ['https://twitter.com/', {
      rawLink: 'https://twitter.com/',
      formattedLink: 'https://twitter.com/',
      displayLink: 'https://twitter.com',
      icon: IconId.Common
    }],
    ['https://instagram.com/tezospayments', {
      rawLink: 'https://instagram.com/tezospayments',
      formattedLink: 'https://instagram.com/tezospayments',
      displayLink: 'tezospayments',
      icon: IconId.Instagram
    }],
    ['https://instagram.com', {
      rawLink: 'https://instagram.com',
      formattedLink: 'https://instagram.com',
      displayLink: 'https://instagram.com',
      icon: IconId.Common
    }],
    ['https://github.com/tezospayments', {
      rawLink: 'https://github.com/tezospayments',
      formattedLink: 'https://github.com/tezospayments',
      displayLink: 'tezospayments',
      icon: IconId.GitHub
    }],
    ['https://github.com', {
      rawLink: 'https://github.com',
      formattedLink: 'https://github.com',
      displayLink: 'https://github.com',
      icon: IconId.Common
    }],
    ['https://www.reddit.com/r/tezospayments', {
      rawLink: 'https://www.reddit.com/r/tezospayments',
      formattedLink: 'https://www.reddit.com/r/tezospayments',
      displayLink: 'r/tezospayments',
      icon: IconId.Reddit
    }],
    ['https://www.reddit.com/user/tezospayments', {
      rawLink: 'https://www.reddit.com/user/tezospayments',
      formattedLink: 'https://www.reddit.com/user/tezospayments',
      displayLink: 'user/tezospayments',
      icon: IconId.Reddit
    }],
    ['https://www.reddit.com', {
      rawLink: 'https://www.reddit.com',
      formattedLink: 'https://www.reddit.com',
      displayLink: 'https://www.reddit.com',
      icon: IconId.Common
    }],
    ['test@tezospayment.com', {
      rawLink: 'test@tezospayment.com',
      formattedLink: 'mailto:test@tezospayment.com',
      displayLink: 'test@tezospayment.com',
      icon: IconId.Email
    }],
    ['test.test-test+test@tezospayment.com', {
      rawLink: 'test.test-test+test@tezospayment.com',
      formattedLink: 'mailto:test.test-test+test@tezospayment.com',
      displayLink: 'test.test-test+test@tezospayment.com',
      icon: IconId.Email
    }],
    ['    test.test-test+test@tezospayment.com         ', {
      rawLink: '    test.test-test+test@tezospayment.com         ',
      formattedLink: 'mailto:test.test-test+test@tezospayment.com',
      displayLink: 'test.test-test+test@tezospayment.com',
      icon: IconId.Email
    }],
    ['https://test.test@tezospayment.com', {
      rawLink: 'https://test.test@tezospayment.com',
      formattedLink: 'https://test.test@tezospayment.com',
      displayLink: 'https://test.test@tezospayment.com',
      icon: IconId.Common
    }],
    ['xxx://test.com', {
      rawLink: 'xxx://test.com',
      formattedLink: 'xxx://test.com',
      displayLink: 'xxx://test.com',
      icon: IconId.Common
    }]
  ];

  test.each(validLinkTestCases)('parsing the valid link [%p]', (link, expectedLinkInfo) => {
    const linkInfo = serviceLinkHelper.getLinkInfo(link);

    expect(linkInfo).toEqual(expectedLinkInfo);
  });

  const invalidLinks: readonly string[] = [
    'javascript:alert(111)',
    'test.test@tezospayment.com@test',
    '192.168.1.1',
    'text'
  ];

  test.each(invalidLinks)('parsing the invalid link [%p]', link => {
    const linkInfo = serviceLinkHelper.getLinkInfo(link);

    expect(linkInfo).toEqual(null);
  });
});
