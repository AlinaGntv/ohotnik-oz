import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { pageSeo, restaurantSchema, siteUrl } from '../data/seo.js'

function setMeta(attribute, key, value) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = value
}

export default function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = pageSeo[pathname]
    const title = page?.title ?? 'Страница не найдена — ресторан «Охотник»'
    const description = page?.description ?? 'Страница не найдена. Перейдите на сайт ресторана «Охотник» в Орехово-Зуеве.'
    const canonicalUrl = `${siteUrl}${page ? pathname === '/' ? '/' : pathname : '/'}`
    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', page ? 'index,follow' : 'noindex,follow')
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'Ресторан «Охотник»')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', `${siteUrl}/images/logo.webp`)
    setMeta('name', 'twitter:card', 'summary_large_image')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = canonicalUrl

    let schema = document.getElementById('restaurant-schema')
    if (pathname === '/') {
      if (!schema) {
        schema = document.createElement('script')
        schema.id = 'restaurant-schema'
        schema.type = 'application/ld+json'
        document.head.append(schema)
      }
      schema.textContent = JSON.stringify(restaurantSchema)
    } else {
      schema?.remove()
    }
  }, [pathname])

  return null
}
