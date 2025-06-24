import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/configuration',
      ],
    },
    {
      type: 'category',
      label: '📚 Introduction',
      items: [
        'introduction/features',
        'technical/architecture',
      ],
    },
    {
      type: 'category',
      label: '🛠️ Technical',
      items: [
        'technical/developer-guide',
        'technical/setup',
      ],
    },
  ],

  // API Reference sidebar
  apiSidebar: [
    {
      type: 'category',
      label: '📖 API Reference',
      items: [
        'api/README',
      ],
    },
    {
      type: 'category',
      label: '🔗 Smart Contracts',
      items: [
        'smart-contracts/README',
      ],
    },
  ],

  // User Guide sidebar
  userGuideSidebar: [
    {
      type: 'category',
      label: '🚗 For Drivers',
      items: [
        'user-guide/drivers/README',
        'user-guide/drivers/creating-account',
        'user-guide/drivers/listing-vehicle',
        'user-guide/drivers/managing-payments',
        'user-guide/drivers/vehicle-maintenance',
      ],
    },
    {
      type: 'category',
      label: '💰 For Investors',
      items: [
        'user-guide/investors/README',
        'user-guide/investors/creating-account',
        'user-guide/investors/opportunities',
        'user-guide/investors/portfolio-management',
      ],
    },
    {
      type: 'category',
      label: '📚 Resources',
      items: [
        'resources/faq',
        'resources/troubleshooting',
        'resources/changelog',
        'resources/contributing',
      ],
    },
  ],
};

export default sidebars;
