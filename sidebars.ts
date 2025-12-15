import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: [
        {
          type: 'category',
          label: 'Getting Started',
          items: ['intro', 'tutorial-basics/create-a-document'],
        },
        {
          type: 'category',
          label: 'Advanced Features',
          items: ['tutorial-basics/create-a-blog-post'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 1: The Robotic Nervous System',
      items: [
        {
          type: 'doc',
          id: 'module-1/the-robotic-nervous-system',
          label: 'The Robotic Nervous System',
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 2: The Digital Twin (Gazebo & Unity)',
      items: [
        {
          type: 'doc',
          id: 'module-2/the-digital-twin',
          label: 'The Digital Twin',
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 3: The AI-Robot Brain (NVIDIA Isaac™)',
      items: [
        {
          type: 'doc',
          id: 'module-3/the-ai-robot-brain',
          label: 'The AI-Robot Brain',
        },
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      items: [
        {
          type: 'doc',
          id: 'module-4/vision-language-action',
          label: 'Vision-Language-Action',
        },
      ],
    },
  ],
};

export default sidebars;