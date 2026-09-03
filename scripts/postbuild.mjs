/**
 * Post-build SEO pass.
 *
 * A single-page app ships one index.html, which means every route would share
 * one <title> until React hydrates. This script writes a real HTML file per
 * route with the correct head tags and structured data already in place, plus
 * sitemap.xml and robots.txt. Crawlers and social scrapers that do not execute
 * JavaScript therefore still get accurate metadata.
 */

import { readFile, writeFile, mkdir, cp, access } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = join(root, 'dist')

const { SITE } = await import(new URL('../src/data/site.js', import.meta.url))
const nav = await import(new URL('../src/data/navigation.js', import.meta.url))
const { POSTS } = await import(new URL('../src/data/posts.js', import.meta.url))
const { seoService, truncate } = await import(new URL('../src/lib/seoService.js', import.meta.url))

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))

const abs = (path) => `${SITE.url}${path === '/' ? '' : path}`

/* ------------------------------------------------------------------ */
/* The full route list                                                 */
/* ------------------------------------------------------------------ */

const routes = [
  ...nav.ALL_PAGES.map((page) => {
    const dynamic = seoService.get(page.path)
    const rawTitle = dynamic.title
    const fullTitle = rawTitle.includes(SITE.name) || page.path === '/' ? rawTitle : `${rawTitle} | ${SITE.name}`
    const finalTitle = truncate(fullTitle, 65)

    return {
      path: page.path,
      title: finalTitle,
      description: dynamic.description,
      keywords: dynamic.keywords || [],
      type: 'website',
      priority: page.path === '/' ? '1.0' : page.groupId === 'site' ? '0.5' : '0.8',
      changefreq: page.groupId === 'blog' ? 'weekly' : 'monthly',
    }
  }),
  ...POSTS.map((post) => {
    const path = `/blog/post/${post.slug}`
    const dynamic = seoService.get(path)
    const rawTitle = dynamic.title
    const fullTitle = rawTitle.includes(SITE.name) ? rawTitle : `${rawTitle} | ${SITE.name}`
    const finalTitle = truncate(fullTitle, 65)

    return {
      path: path,
      title: finalTitle,
      description: dynamic.description,
      keywords: dynamic.keywords || [],
      type: 'article',
      lastmod: post.updated || post.date,
      priority: '0.7',
      changefreq: 'monthly',
    }
  }),
]

/* ------------------------------------------------------------------ */
/* Structured data per route                                           */
/* ------------------------------------------------------------------ */

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}${SITE.logo}`,
  description: SITE.description,
}

function schemaFor(route) {
  if (route.path === '/') {
    return [
      organization,
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
      },
    ]
  }
  if (route.type === 'article') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: route.title.split(' | ')[0].slice(0, 110),
        description: route.description,
        image: [`${SITE.url}${SITE.ogImage}`],
        datePublished: route.lastmod,
        dateModified: route.lastmod,
        author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        publisher: {
          '@type': 'Organization',
          name: SITE.name,
          logo: { '@type': 'ImageObject', url: `${SITE.url}${SITE.logo}` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': abs(route.path) },
      },
    ]
  }
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: route.title.split(' | ')[0],
      url: abs(route.path),
      description: route.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: organization,
    },
  ]
}

/* ------------------------------------------------------------------ */
/* Head injection                                                      */
/* ------------------------------------------------------------------ */

function buildHead(route) {
  const canonical = abs(route.path)
  const image = `${SITE.url}${SITE.ogImage}`
  const tags = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}">`,
    route.keywords.length ? `<meta name="keywords" content="${escapeHtml(route.keywords.join(', '))}">` : '',
    `<link rel="canonical" href="${canonical}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`,
    `<meta property="og:type" content="${route.type}">`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}">`,
    `<meta property="og:title" content="${escapeHtml(route.title)}">`,
    `<meta property="og:description" content="${escapeHtml(route.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:locale" content="${SITE.locale}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:site" content="${SITE.twitter}">`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    ...schemaFor(route).map(
      (schema) => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
  return tags.filter(Boolean).join('\n    ')
}

function injectHead(template, route) {
  // Strip the build-time defaults so each page has exactly one of each tag.
  const stripped = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '')

  return stripped.replace('</head>', `  ${buildHead(route)}\n  </head>`)
}

/* ------------------------------------------------------------------ */
/* Sitemap and robots                                                  */
/* ------------------------------------------------------------------ */

function buildSitemap(today) {
  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${abs(route.path)}</loc>
    <lastmod>${route.lastmod || today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

const robots = `# ${SITE.name}
User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`

/* ------------------------------------------------------------------ */

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function run() {
  if (!(await exists(dist))) {
    console.error('dist/ not found — run `vite build` first.')
    process.exitCode = 1
    return
  }

  const template = await readFile(join(dist, 'index.html'), 'utf8')
  const today = new Date().toISOString().slice(0, 10)

  let written = 0
  for (const route of routes) {
    const html = injectHead(template, route)
    if (route.path === '/') {
      await writeFile(join(dist, 'index.html'), html)
    } else {
      const dir = join(dist, route.path.replace(/^\//, ''))
      await mkdir(dir, { recursive: true })
      await writeFile(join(dir, 'index.html'), html)
    }
    written += 1
  }

  const publicDir = join(root, 'public')
  await writeFile(join(publicDir, 'sitemap.xml'), buildSitemap(today))
  await writeFile(join(publicDir, 'robots.txt'), robots)

  // Single-page hosts (Netlify, Vercel, Cloudflare Pages) need a rewrite rule
  // so unknown deep links still boot the app rather than 404ing.
  await writeFile(join(dist, '_redirects'), '/*    /index.html   200\n')
  await writeFile(
    join(dist, '404.html'),
    injectHead(template, {
      path: '/404',
      title: `Page not found | ${SITE.name}`,
      description: 'That page does not exist. Browse all free writing tools instead.',
      keywords: [],
      type: 'website',
    }).replace('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />', '<meta name="robots" content="noindex, follow">'),
  )

  await renderIcons()

  if (await exists(publicDir)) await cp(publicDir, dist, { recursive: true, force: true })

  await renderOgImage()

  console.log(`postbuild: ${written} route pages, sitemap.xml (${routes.length} URLs), robots.txt, 404.html`)
}

/**
 * Renders apple-touch-icon and favicons from the logo SVG.
 */
async function renderIcons() {
  const source = join(root, 'public', 'logo.svg')
  if (!(await exists(source))) return
  const publicDir = join(root, 'public')
  try {
    const { default: sharp } = await import('sharp')
    const logoBuffer = await readFile(source)
    await sharp(logoBuffer).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'))
    await sharp(logoBuffer).resize(192, 192).png().toFile(join(publicDir, 'favicon-192x192.png'))
    await sharp(logoBuffer).resize(32, 32).png().toFile(join(publicDir, 'favicon-32x32.png'))
    console.log('postbuild: favicon and apple-touch-icon PNGs generated in public/')
  } catch (error) {
    console.warn(`postbuild: could not generate PNG icons — ${error.message}`)
  }
}

/**
 * Facebook, X and LinkedIn do not render SVG previews, so the social card is
 * authored as SVG and rasterised here.
 */
async function renderOgImage() {
  const source = join(root, 'public', 'og-default.svg')
  if (!(await exists(source))) return
  try {
    const { default: sharp } = await import('sharp')
    const png = await sharp(await readFile(source)).resize(1200, 630).png().toBuffer()
    await writeFile(join(dist, 'og-default.png'), png)
    console.log('postbuild: og-default.png rendered (1200×630)')
  } catch (error) {
    console.warn(`postbuild: could not render og-default.png — ${error.message}`)
  }
}

run()
