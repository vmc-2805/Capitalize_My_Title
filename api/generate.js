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

// Node.js runtime on Vercel: the Web-standard Request/Response signature is
// supported natively, and it allows the provider SDKs that the edge runtime
// cannot bundle.
export const config = { runtime: 'nodejs' }
