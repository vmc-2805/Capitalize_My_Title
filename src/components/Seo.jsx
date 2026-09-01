import { SITE } from '../data/site.js'
import { seoService, truncate } from '../lib/seoService.js'

/**
 * React 19 hoists <title>, <meta> and <link> to <head> automatically, so no
 * helmet library is needed. Every page renders exactly one of these.
 */
export default function Seo({
  title,
  description,
  path = '/',
  keywords = [],
  image = SITE.ogImage,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
  jsonLd = [],
}) {
  const dynamicMeta = seoService.get(path)
  const activeTitle = dynamicMeta.title || truncate(title, 65) || ''
  const activeDescription = dynamicMeta.description || truncate(description, 165) || ''
  const activeKeywords = dynamicMeta.keywords?.length > 0 ? dynamicMeta.keywords : keywords

  const canonical = `${SITE.url}${path === '/' ? '' : path}`
  const fullTitle = activeTitle.includes(SITE.name) || path === '/' ? activeTitle : `${activeTitle} | ${SITE.name}`
  const finalTitle = truncate(fullTitle, 65)
  const imageUrl = image.startsWith('http') ? image : `${SITE.url}${image}`
  const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd]

  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={activeDescription} />
      {activeKeywords.length > 0 && <meta name="keywords" content={activeKeywords.join(', ')} />}
      <meta name="author" content={SITE.publisher} />
      <link rel="canonical" href={canonical} />
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      {noindex && <meta name="robots" content="noindex, follow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />}

      {/* Google Search Console ownership verification — set VITE_GSC_ID in .env */}
      {SITE.gscId && <meta name="google-site-verification" content={SITE.gscId} />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={activeDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={SITE.locale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={activeDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {blocks.filter(Boolean).map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Structured data is generated from our own page registry, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Structured data builders                                            */
/* ------------------------------------------------------------------ */

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}${SITE.logo}`,
  foundingDate: SITE.founded,
  description: SITE.description,
})

export const websiteSchema = () => {
  const dynamic = seoService.get('/')
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: dynamic.description || SITE.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/tools?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export const softwareSchema = (page) => {
  const dynamic = seoService.get(page.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: dynamic.title.split(' | ')[0] || page.h1 || page.label,
    url: `${SITE.url}${page.path}`,
    description: dynamic.description || page.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  }
}

export const breadcrumbSchema = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.label,
    item: `${SITE.url}${crumb.href}`,
  })),
})

export const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
})

export const articleSchema = (post) => {
  const path = `/blog/post/${post.slug}`
  const dynamic = seoService.get(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: dynamic.title.split(' | ')[0] || post.title.slice(0, 110),
    description: dynamic.description || post.description,
    image: [`${SITE.url}${SITE.ogImage}`],
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}${SITE.logo}` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/post/${post.slug}` },
    wordCount: post.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
  }
}

export const itemListSchema = (items, name) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.label,
    url: `${SITE.url}${item.path}`,
  })),
})
