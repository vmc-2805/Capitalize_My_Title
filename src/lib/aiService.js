/**
 * Gets generated text from the server when a key is configured, and from the
 * built-in template generators when it is not.
 *
 * The fallback is the point of this module: the site has no backend by default,
 * so every failure path — no endpoint, no key, network down, a refusal — has to
 * land on working templates rather than an error. A tool must never be broken
 * by an optional feature being switched off.
 */

import { generatePrompts, generateSpeech, generateTitles } from './generators.js'

/** Requests that hang would leave the button spinning, so they are cut short. */
const TIMEOUT_MS = 30000

/**
 * Set once the server has told us it has no key, so the site stops asking on
 * every click. Only reset by a reload, which is when the answer could change.
 */
let serverUnavailable = false

export const isServerKnownUnavailable = () => serverUnavailable

/** Used by tests to undo the memo between cases. */
export const resetServerState = () => {
  serverUnavailable = false
}

/**
 * Asks the server for one list, falling back to `local()` on every failure.
 *
 * It never throws: a caller that only wants the list can ignore `source`
 * entirely and still always get something usable.
 */
async function requestList(body, local) {
  const fallback = () => ({ items: local(), source: 'local' })
  if (serverUnavailable || typeof fetch !== 'function') return fallback()

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    // A 404 means the site was deployed without the function at all. Retrying
    // on every click would put a failed request in the console each time, so
    // one probe per page load is enough. A 429 or 502 is temporary and is
    // worth trying again later, so those are not remembered.
    if (response.status === 404 || response.status === 405) {
      serverUnavailable = true
      return fallback()
    }

    if (!response.ok) return fallback()

    const data = await response.json()

    // The server reports a missing key as a normal result, not an error, so
    // remember it and stop asking.
    if (data.configured === false) {
      serverUnavailable = true
      return fallback()
    }

    if (!Array.isArray(data.items) || data.items.length === 0) return fallback()

    return { items: data.items, source: 'ai' }
  } catch {
    // Offline, aborted, or blocked — all the same to the reader, who just
    // wants a result. Not remembered: the network may come back.
    return fallback()
  } finally {
    clearTimeout(timer)
  }
}

/** Returns `{ titles, source }` where source is `'ai'` or `'local'`. */
export async function requestTitles(kind, topic, options = {}) {
  const { items, source } = await requestList({ task: 'titles', kind, topic, ...options }, () =>
    generateTitles(kind, topic, options),
  )
  return { titles: items, source }
}

/** Returns `{ prompts, source }` where source is `'ai'` or `'local'`. */
export async function requestPrompts({ kind, subject, count, seed }) {
  const { items, source } = await requestList({ task: 'prompts', kind, subject, count }, () =>
    generatePrompts({ kind, subject, count, seed }),
  )
  return { prompts: items, source }
}

/**
 * Returns `{ speech, source }` — one string, not a list.
 *
 * The model returns the speech a paragraph at a time so the response shape
 * stays the same as every other task; joining them back up belongs here rather
 * than in the page.
 */
export async function requestSpeech({ topic, occasion, minutes, seed }) {
  const { items, source } = await requestList(
    { task: 'speech', subject: topic, occasion, minutes },
    () => [generateSpeech({ topic, occasion, minutes, seed })],
  )
  return { speech: items.join('\n\n'), source }
}
