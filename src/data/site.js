/** Site-wide constants used by SEO tags, structured data and the sitemap. */
export const SITE = {
  name: 'Capitalize Titaly',
  shortName: 'CapitalizeTitaly',
  // Change this once at launch and every canonical, sitemap and OG URL follows.
  url: 'https://capitalizetitaly.com',
  locale: 'en_US',
  twitter: '@capitalizetitaly',
  tagline: 'Free title case converter and writing tools',
  description:
    'Capitalize titles instantly in APA, Chicago, AP, MLA, Bluebook, AMA, NYT and Wikipedia style. Plus free converters, word tools, title generators and text generators.',
  founded: '2025',
  publisher: 'Capitalize Titaly',
  logo: '/Logo.png',
  ogImage: '/og-default.png',

  // ── Google Search Console ─────────────────────────────────────────────────
  // Set VITE_GSC_ID in .env with the content= value from the HTML meta tag
  // that Search Console gives you (e.g. "abcdef1234567890").
  // Injected as <meta name="google-site-verification" content="..."> in Seo.jsx
  gscId: import.meta.env?.VITE_GSC_ID || '',
}

export const PRIMARY_KEYWORDS = [
  'capitalize titaly',
  'title case converter',
  'title capitalization tool',
  'apa title case',
  'chicago title case',
  'ap style title case',
  'mla title case',
  'convert to title case',
  'headline capitalization',
]
