import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://story75.github.io',
  base: '/pixel-forge',
  integrations: [
    starlight({
      title: 'Pixel Forge',
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
