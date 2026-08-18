/**
 * Which model service to call, chosen from whichever key is present.
 *
 * The site works with no key at all, so this is entirely optional. When a key
 * is set the endpoint uses it, and the caller never has to know which service
 * answered — the response contract is identical either way.
 *
 * Two shapes cover every service here: Anthropic's own Messages API, and the
 * OpenAI chat-completions shape, which Groq, Google, OpenRouter and Mistral all
 * speak as well. That is why adding a service below is a table entry, not a new
 * code path.
 */

/**
 * Checked in order, so setting two keys is not ambiguous.
 *
 * Model names change faster than this file does — `LLM_MODEL` overrides the
 * default for whichever service is selected, so a retired model is a config
 * change rather than a code change.
 */
export const PROVIDERS = [
  {
    id: 'anthropic',
    label: 'Anthropic',
    envKey: 'ANTHROPIC_API_KEY',
    api: 'anthropic',
    model: 'claude-opus-5',
    freeTier: false,
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    envKey: 'GEMINI_API_KEY',
    api: 'openai',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    // The `-latest` alias rather than a pinned version: Google retires numbered
    // Gemini models quickly, and a retired model is a 404, not a warning.
    model: 'gemini-flash-latest',
    freeTier: true,
  },
  {
    id: 'groq',
    label: 'Groq',
    envKey: 'GROQ_API_KEY',
    api: 'openai',
    baseURL: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    freeTier: true,
  },
  {
    id: 'openai',
    label: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    api: 'openai',
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    freeTier: false,
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    envKey: 'OPENROUTER_API_KEY',
    api: 'openai',
    baseURL: 'https://openrouter.ai/api/v1',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    freeTier: true,
  },
  {
    id: 'mistral',
    label: 'Mistral',
    envKey: 'MISTRAL_API_KEY',
    api: 'openai',
    baseURL: 'https://api.mistral.ai/v1',
    model: 'mistral-small-latest',
    freeTier: false,
  },
]

/** Returns the configured provider, or null when no key is set anywhere. */
export function resolveProvider(env = {}) {
  const found = PROVIDERS.find((p) => env[p.envKey])
  if (!found) return null

  // ANTHROPIC_BASE_URL is only honoured for Anthropic — it is that SDK's own
  // variable, and letting it redirect Gemini or Groq would be a surprise.
  const override =
    env.LLM_BASE_URL || (found.api === 'anthropic' ? env.ANTHROPIC_BASE_URL : '')

  return {
    ...found,
    apiKey: env[found.envKey],
    model: env.LLM_MODEL || found.model,
    baseURL: override || found.baseURL,
  }
}

/**
 * Pulls the list out of whatever the service returned.
 *
 * Models wrap JSON in code fences often enough that stripping them is worth the
 * three lines, and they name the array `titles` about as often as `items` even
 * when told otherwise. Anything still unparseable yields an empty list, which
 * the client treats as "fall back to templates" rather than as an error.
 */
export function parseList(text) {
  const cleaned = String(text || '')
    .replace(/^\s*```(?:json)?/i, '')
    .replace(/```\s*$/, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    const list = Array.isArray(parsed) ? parsed : parsed.items || parsed.titles || parsed.prompts
    if (!Array.isArray(list)) return []
    return list.map((t) => String(t).trim()).filter(Boolean)
  } catch {
    return []
  }
}

/* ------------------------------------------------------------------ */
/* Anthropic                                                           */
/* ------------------------------------------------------------------ */

async function callAnthropic(provider, { system, prompt, maxTokens, effort, schema }) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({
    apiKey: provider.apiKey,
    ...(provider.baseURL ? { baseURL: provider.baseURL } : {}),
  })

  const response = await client.messages.create({
    model: provider.model,
    max_tokens: maxTokens,
    system,
    output_config: { effort, format: { type: 'json_schema', schema } },
    messages: [{ role: 'user', content: prompt }],
  })

  // The classifiers can decline a request; that arrives as a normal 200 with an
  // empty body, so stop_reason has to be checked before reading content.
  if (response.stop_reason === 'refusal') return { refused: true, items: [] }

  return {
    items: parseList(response.content.find((b) => b.type === 'text')?.text),
    usage: {
      input_tokens: response.usage?.input_tokens ?? 0,
      output_tokens: response.usage?.output_tokens ?? 0,
    },
  }
}

/* ------------------------------------------------------------------ */
/* OpenAI-compatible (OpenAI, Groq, Gemini, OpenRouter, Mistral)       */
/* ------------------------------------------------------------------ */

async function callOpenAiCompatible(provider, { system, prompt, maxTokens }) {
  const response = await fetch(`${provider.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model,
      max_tokens: maxTokens,
      // `json_object` rather than a full schema: every service in the table
      // supports it, while schema support is uneven. The prompt states the
      // shape, and parseTitles tolerates the rest.
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const error = new Error(`${provider.label} returned ${response.status}`)
    error.status = response.status
    throw error
  }

  const data = await response.json()
  return {
    items: parseList(data.choices?.[0]?.message?.content),
    usage: {
      input_tokens: data.usage?.prompt_tokens ?? 0,
      output_tokens: data.usage?.completion_tokens ?? 0,
    },
  }
}

/** One call, whichever service is configured. */
export function generate(provider, request) {
  return provider.api === 'anthropic'
    ? callAnthropic(provider, request)
    : callOpenAiCompatible(provider, request)
}
