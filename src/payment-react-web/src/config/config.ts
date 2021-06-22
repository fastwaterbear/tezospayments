import { AppConfig } from './appConfig';

export const config: AppConfig = {
  app: {
    publicUrl: process.env.PUBLIC_URL || 'https://github.com/fastwaterbear/',
    sourcesUrl: 'https://github.com/fastwaterbear/',
    name: 'Tezos Payments',
    title: 'Tezos Payments',
    buildInfo: {
      commitShortSha: process.env.REACT_APP_COMMIT_SHORT_SHA || ''
    }
  },
  tezosOfficialSiteUrl: 'https://tezos.com/'
};
