import { SITE } from '../data/site.js'

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
  const canonical = `${SITE.url}${path === '/' ? '' : path}`
  const fullTitle = title.includes(SITE.name) || path === '/' ? title : `${title} | ${SITE.name}`
  const imageUrl = image.startsWith('http') ? image : `${SITE.url}${image}`
  const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd]

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={SITE.locale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
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

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/tools?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
})

export const softwareSchema = (page) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: page.h1 || page.label,
  url: `${SITE.url}${page.path}`,
  description: page.description,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
})

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

export const articleSchema = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title.slice(0, 110),
  description: post.description,
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
})

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
