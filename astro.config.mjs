import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.titus-corlatean.ro',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  build: {
    // /povestea-mea.html is served at /povestea-mea — same URLs as the old Squarespace site
    format: 'file',
  },
  redirects: {
    '/acasa': '/',
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(team-1|facebook-app|acasa|404)$/.test(page),
    }),
  ],
});
