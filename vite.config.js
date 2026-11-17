import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pageSeo, restaurantSchema, siteUrl } from './src/data/seo.js'

function routeHtml() {
  return {
    name: 'route-html-seo',
    async closeBundle() {
      const outputDir = resolve('dist')
      const template = await readFile(resolve(outputDir, 'index.html'), 'utf8')
      for (const [route, page] of Object.entries(pageSeo)) {
        if (route === '/') continue
        const routeDir = resolve(outputDir, route.slice(1))
        await mkdir(routeDir, { recursive: true })
        const canonicalUrl = `${siteUrl}${route}`
        const html = template
          .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${page.description}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${page.title}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${page.description}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${canonicalUrl}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${canonicalUrl}$2`)
          .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, `<script type="module" crossorigin src="$1"></script>`)
        await writeFile(resolve(routeDir, 'index.html'), html)
      }
      const homePath = resolve(outputDir, 'index.html')
      const homeHtml = await readFile(homePath, 'utf8')
      const schemaScript = `<script id="restaurant-schema" type="application/ld+json">${JSON.stringify(restaurantSchema)}</script>`
      await writeFile(homePath, homeHtml.replace('</head>', `${schemaScript}\n  </head>`))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), routeHtml()],
  server: {
    // в разработке PHP нет: запросы к /api уходят на боевой сайт
    // (сами заявки отправляются, только если в .env.local VITE_SEND_REQUESTS=true)
    proxy: {
      '/api': { target: 'https://ohotnik-oz.ru', changeOrigin: true, secure: true },
    },
  },
})
