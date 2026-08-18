/** Site-wide constants used by SEO tags, structured data and the sitemap. */
export const SITE = {
  name: 'Capitalize My Title',
  shortName: 'CapitalizeMyTitle',
  // Change this once at launch and every canonical, sitemap and OG URL follows.
  url: 'https://capitalizemytitle.com',
  locale: 'en_US',
  twitter: '@capitalizetitle',
  tagline: 'Free title case converter and writing tools',
  description:
    'Capitalize titles instantly in APA, Chicago, AP, MLA, Bluebook, AMA, NYT and Wikipedia style. Plus free converters, word tools, title generators and text generators.',
  founded: '2015',
  publisher: 'Capitalize My Title',
  logo: '/logo.svg',
  ogImage: '/og-default.png',
  // Set VITE_GA_ID at build time to enable analytics; blank means no scripts load.
  analyticsId: import.meta.env?.VITE_GA_ID || '',
}

export const PRIMARY_KEYWORDS = [
  'capitalize my title',
  'title case converter',
  'title capitalization tool',
  'apa title case',
  'chicago title case',
  'ap style title case',
  'mla title case',
  'convert to title case',
  'headline capitalization',
]
