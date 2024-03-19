import starlight from '@astrojs/starlight';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineConfig } from 'astro/config';

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
