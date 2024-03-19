import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';

export default defineConfig({
  site: 'https://story75.github.io',
  base: '/pixel-forge',
  integrations: [
    starlight({
      title: 'Pixel Forge',
      expressiveCode: {
        plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
      },
      social: {
        github: 'https://github.com/story75/pixel-forge',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Why Pixel Forge?', link: '/guides/why/' },
            { label: 'Getting started', link: '/guides/getting-started/' },
          ],
        },
      ],
    }),
  ],
});
