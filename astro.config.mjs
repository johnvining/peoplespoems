import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  output: 'static',
  site: 'https://www.peoplespoems.com',
  integrations: [
    sitemap({
      filter: (page) => {
        const parts = new URL(page).pathname.split('/').filter(Boolean)
        // For poem URLs (first segment is all digits), only include the canonical
        // form: 5-digit zero-padded number + slug (e.g. /00001/the-raven)
        if (parts.length > 0 && /^\d+$/.test(parts[0])) {
          return parts[0].length === 5 && parts.length >= 2
        }
        return true
      },
    }),
  ],
})
