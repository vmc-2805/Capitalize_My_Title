import { ALL_PAGES } from '../data/navigation.js'
import { POSTS } from '../data/posts.js'

/**
 * Truncates a string to a specific limit, adding ellipses if it exceeds the limit.
 */
export function truncate(str, limit) {
  if (!str) return ''
  if (str.length <= limit) return str
  return str.slice(0, limit - 3) + '...'
}

const defaultSeoData = {}

// Populate default registry from navigation configuration
ALL_PAGES.forEach((page) => {
  defaultSeoData[page.path] = {
    title: page.title || '',
    description: page.description || '',
    keywords: page.keywords || [],
    h1: page.h1 || '',
    intro: page.intro || '',
  }
})

// Populate default registry from blog posts
POSTS.forEach((post) => {
  const path = `/blog/post/${post.slug}`
  defaultSeoData[path] = {
    title: post.title || '',
    description: post.description || '',
    keywords: post.keywords || [],
    h1: post.title || '',
    intro: post.excerpt || '',
  }
})

// Set up a global overrides store in the window object (if running in browser)
const globalObj = typeof window !== 'undefined' ? window : {}
if (!globalObj.SEO_OVERRIDES) {
  globalObj.SEO_OVERRIDES = {}
}

export const seoService = {
  /**
   * Retrieves SEO values for a given route path, merging overrides
   * and enforcing title (max 65 chars) and description (max 165 chars) limits.
   */
  get(path) {
    const defaultData = defaultSeoData[path] || {}
    const overrideData = globalObj.SEO_OVERRIDES[path] || {}

    const title = overrideData.title !== undefined ? overrideData.title : defaultData.title || ''
    const description = overrideData.description !== undefined ? overrideData.description : defaultData.description || ''
    const keywords = overrideData.keywords !== undefined ? overrideData.keywords : defaultData.keywords || []
    const h1 = overrideData.h1 !== undefined ? overrideData.h1 : defaultData.h1 || ''
    const intro = overrideData.intro !== undefined ? overrideData.intro || '' : defaultData.intro || ''

    return {
      title: truncate(title, 65),
      description: truncate(description, 165),
      keywords,
      h1,
      intro,
    }
  },

  /**
   * Overrides/Sets SEO metadata for a route path dynamically (e.g. from Admin Panel API).
   */
  set(path, data) {
    globalObj.SEO_OVERRIDES[path] = {
      ...globalObj.SEO_OVERRIDES[path],
      ...data,
    }
  },

  /**
   * Expose raw data for sitemap or tests.
   */
  getAllDefaults() {
    return defaultSeoData
  },
}
