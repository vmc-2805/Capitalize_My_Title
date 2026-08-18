/**
 * Vercel and Netlify entry point.
 *
 * Both accept a default export taking a Web-standard Request and returning a
 * Response, so the shared handler is used unchanged.
 */

import { handleGenerate } from './_generate-core.js'

export default async function handler(request) {
  return handleGenerate(request, process.env)
}

// Vercel runs this at the edge, where the Web-standard APIs above are native.
export const config = { runtime: 'edge' }
