import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Module 1: Introduction',
      items: [
        {
          type: 'category',
          label: 'Chapter 1: Getting Started',
          items: ['intro', 'tutorial-basics/create-a-document'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Advanced Topics',
      items: [
        {
          type: 'category',
          label: 'Chapter 1: Advanced Features',
          items: ['tutorial-basics/create-a-blog-post'],
        },
      ],
    },
  ],
};

export default sidebars;