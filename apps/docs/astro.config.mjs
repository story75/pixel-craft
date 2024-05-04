import starlight from '@astrojs/starlight';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://story75.github.io',
  base: '/pixel-craft',
  integrations: [
    starlight({
      title: 'Pixel Craft',
      expressiveCode: {
        plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
      },
      social: {
        github: 'https://github.com/story75/pixel-craft',
      },
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Why Pixel Craft?', link: '/overview/why/' },
            { label: 'Features', link: '/overview/features/' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Getting started', link: '/guides/getting-started/' },
            {
              label: 'Advanced',
              items: [
                {
                  label: 'Raw engine integration',
                  link: '/guides/advanced/raw-integration',
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
