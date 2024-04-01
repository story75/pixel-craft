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
          label: 'Guides',
          items: [
            { label: 'Why Pixel Craft?', link: '/guides/why/' },
            { label: 'Getting started', link: '/guides/getting-started/' },
          ],
        },
      ],
    }),
  ],
});
