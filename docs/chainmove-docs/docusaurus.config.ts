import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'ChainMove Documentation',
  tagline: 'Revolutionary blockchain platform enabling fractional vehicle ownership and mobility asset tokenization',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.chainmove.xyz',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'obiajulu-gif', // Usually your GitHub org/user name.
  projectName: 'chain_move', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/obiajulu-gif/chain_move/tree/main/docs/chainmove-docs/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

  themeConfig: {
    // Replace with your project's social card
    image: 'img/chainmove-social-card.jpg',
    navbar: {
      title: 'ChainMove',
      logo: {
        alt: 'ChainMove Logo',
        src: 'img/chainmovelogo.png',
        href: 'https://github.com/obiajulu-gif/chain_move',
        target: '_blank',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'docSidebar',
          sidebarId: 'userGuideSidebar',
          position: 'left',
          label: 'User Guide',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/obiajulu-gif/chain_move',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started/quick-start',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
            {
              label: 'Smart Contracts',
              to: '/smart-contracts',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/chainmove',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/ChainMove1',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/chainmove',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              href: 'https://www.chainmove.xyz',
            },
            {
              label: 'Marketplace',
              href: 'https://www.chainmove.xyz/marketplace',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/obiajulu-gif/chain_move',
            },
            {
              label: 'Support',
              href: 'https://github.com/obiajulu-gif/chain_move/issues',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ChainMove. All rights reserved. Built on Lisk Layer 2.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity', 'bash', 'json'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    // algolia: {
    //   // Disabled for now - enable when you have Algolia credentials
    //   // See HOW_TO_SETUP_ALGOLIA_SEARCH.md for setup instructions
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
