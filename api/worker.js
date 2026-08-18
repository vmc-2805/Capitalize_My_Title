/**
 * Cloudflare Workers entry point.
 *
 * Workers hand secrets to the handler as `env` rather than putting them on a
 * global, which is why the shared handler takes `env` as an argument.
 */

import { handleGenerate } from './_generate-core.js'

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)
    if (pathname !== '/api/generate') return new Response('Not found', { status: 404 })
    return handleGenerate(request, env)
  },
}
