/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'Tezos Payments Documentation',
  tagline: 'Accept payments, donations, or send invoices using all advantages of the Tezos system.',
  url: 'https://docs.tezospayments.com',
  baseUrl: '/',
  organizationName: 'fastwaterbear',
  projectName: 'tezospayments',
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/fastwaterbear/tezospayments/tree/master/apps/docs',
        },
        pages: false,
        blog: false,
        gtag: false,
        googleAnalytics: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false
      },
      navbar: {
        title: 'Tezos Payments',
        items: [
          {
            type: 'doc',
            docId: 'user-guides/introduction',
            label: 'User Guides',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'concepts/overview',
            label: 'Concepts',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'developers/getting-started',
            label: 'Developers',
            position: 'left',
          },
          {
            href: 'https://github.com/fastwaterbear/tezospayments',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Tezos Payments`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};
