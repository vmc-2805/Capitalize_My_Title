# Capitalize My Title

A complete title-capitalization and writing-tools site built with React 19, Vite 7,
React Router 7 and Tailwind CSS 4. Every tool runs in the browser — no backend, no
API key and no upload. One optional exception: adding a model API key switches the
title and prompt generators to AI-written text (see below).

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build + SEO postbuild
npm run preview    # serve dist/ at http://localhost:4173
npm test           # 89 logic tests (no browser needed)
npm run test:api   # 35 API + provider + fallback tests (stub server, no key needed)
npm run smoke      # 548 browser checks — needs `npm run preview` running
```

## Before you launch

1. **Set your domain.** Change `url` in [`src/data/site.js`](src/data/site.js).
   Every canonical tag, Open Graph URL and sitemap entry is derived from it.
2. **Set the analytics ID.** Create `.env` with `VITE_GA_ID=G-XXXXXXXXXX`.
   Leave it unset and no analytics script loads at all.
3. **Replace the social image.** Edit [`public/og-default.svg`](public/og-default.svg);
   the build rasterises it to `og-default.png` at 1200 × 630.
4. **Set the brand colour.** The `--color-brand-*` scale in
   [`src/index.css`](src/index.css) drives every button, link and accent. The SVGs in
   `public/` carry the same hex, so change both together.

## What is in it

**27 tools**, all real and all client-side.

| Group | Tools |
| --- | --- |
| Homepage | Title capitalization in APA, Chicago, AP, MLA, Bluebook, AMA, NYT, Wikipedia and email style, plus 8 case transforms, headline scoring, a custom dictionary and live text stats |
| Converters | Comma separator, CSV/TSV/JSON/Excel converter (both directions), uppercase → lowercase, square image |
| Title generators | AI title, poem title, book title, YouTube title, essay title |
| Title rewriter | Nine strategic rewrites with live character counts |
| Text generators | Lorem ipsum, Wingdings translator (45 fancy-text styles), bold text, bubble text |
| Other generators | Fortune cookie, invisible characters, random state, AI prompts, text repeater, speech, song, poem, character backstory |
| Name generators | Character names, general name generator, Pokemon names |
| Blog | 9 long-form articles across writing, editing and publishing |

## Optional: AI-written titles and prompts

The five title generators and the AI prompts generator work out of the box using
the built-in template engine — no key, no backend, no network. Adding a model API
key switches them to AI-written text instead; everything else is unchanged.

One endpoint serves them all. A `task` field in the request body picks which kind
of list to write, so a new AI-backed tool is a `TASKS` entry in
`api/_generate-core.js` rather than a new deployment.

```
api/
  _providers.js     Which services are accepted, and how each one is called
  _generate-core.js The handler — Web-standard Request in, Response out
  generate.js       Vercel / Netlify entry point
  worker.js         Cloudflare Workers entry point
vercel.json         Vercel: build + SPA rewrites
netlify.toml        Netlify: functions dir + redirects
wrangler.toml       Cloudflare: Worker + static assets
```

### Which key

Set **one** of these. The first one found is used, in this order, so a single key
is all it takes — no code edit, no rebuild, no flag.

| Service | Variable | Free tier | Get a key |
| --- | --- | --- | --- |
| Anthropic | `ANTHROPIC_API_KEY` | No | [console.anthropic.com](https://console.anthropic.com) |
| Google Gemini | `GEMINI_API_KEY` | **Yes** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| Groq | `GROQ_API_KEY` | **Yes** | [console.groq.com/keys](https://console.groq.com/keys) |
| OpenAI | `OPENAI_API_KEY` | No | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| OpenRouter | `OPENROUTER_API_KEY` | Some models | [openrouter.ai/keys](https://openrouter.ai/keys) |
| Mistral | `MISTRAL_API_KEY` | No | [console.mistral.ai](https://console.mistral.ai) |

Anthropic uses the Messages API; every other service on the list speaks the
OpenAI chat-completions shape, so they share one code path. `LLM_MODEL` overrides
the default model for whichever service is selected — model names get retired
faster than this repo changes, so that stays a config fix rather than a code fix.

Never give any of these a `VITE_` prefix; that prefix is what marks a variable
for the browser bundle.

```bash
# Local — put it in .env, then restart the dev server
echo "GEMINI_API_KEY=..." >> .env
npm run dev

# Vercel — api/generate.js deploys automatically (vercel.json)
vercel env add GEMINI_API_KEY

# Netlify — netlify.toml points functions at api/
netlify env:set GEMINI_API_KEY ...

# Cloudflare — wrangler.toml runs api/worker.js
wrangler secret put GEMINI_API_KEY
```

A real shell variable overrides `.env`, matching how hosting platforms inject
secrets — so `GEMINI_API_KEY=... npm run dev` works for a one-off test without
touching the file.

An Anthropic key requires API credits. A Claude Pro or Max subscription covers
claude.ai and Claude Code — it does **not** include API credits, which are billed
separately.

**Failure is designed for.** No key, no endpoint deployed, network down, rate
limited, or a refusal all land on the template generator. The tool never breaks
because an optional feature is switched off — `npm run test:api` covers each of
those paths against a stub server, so it costs nothing to run.

Shared limits live in `CONFIG` in `api/_generate-core.js`; the per-service model
lives in `api/_providers.js`. Roughly 150 input + 300 output tokens per request.

## Architecture

```
src/
  data/
    navigation.js   Single source of truth: menus, routes, SEO metadata
    posts.js        Blog content
    site.js         Domain, branding, analytics ID
  lib/              Pure logic — no React, fully unit tested
    capitalize.js   The nine style guides, encoded as data + one engine
    textCase.js     Case transforms, text stats, headline scoring
    convert.js      RFC 4180 CSV parser, list/column tools
    aiService.js    AI text when a key is configured, templates when not
    dataFormats.js  CSV / TSV / JSON / Excel conversion in any direction
    generators.js   Seeded title / name / poem / song / prompt generators
    unicode.js      45 Unicode text styles and invisible characters
  components/       Header mega menu, footer, ToolShell, SEO, shared UI kit
  pages/            Tool pages, grouped into modules for sensible chunking
scripts/
  postbuild.mjs     Per-route HTML with real head tags, sitemap, robots, OG PNG
  test.mjs          Logic tests
  smoke.mjs         Playwright checks across every route
```

**Adding a tool** takes three steps: add an entry to `TOOL_GROUPS` in
`src/data/navigation.js`, export a component from the matching page module, and
register its key in `src/routes.jsx`. The menu, the sitemap, the breadcrumbs, the
"all tools" index and the internal linking all pick it up automatically.

## SEO

- Unique title, meta description and keyword set per page, all in the route registry.
- Canonical URLs, Open Graph and Twitter card tags on every route.
- JSON-LD: `Organization`, `WebSite`, `WebApplication`, `BreadcrumbList`, `FAQPage`
  and `BlogPosting`, generated from the same data.
- `scripts/postbuild.mjs` writes a real HTML file per route with the head tags already
  present, so crawlers and social scrapers that do not run JavaScript still get
  correct metadata from a single-page app.
- `sitemap.xml` with per-route priority and change frequency, plus `robots.txt`.
- Long-form supporting copy, an FAQ block and internal links on every tool page.

## Testing

`npm test` covers the pure logic: all nine style guides against known-correct output,
CSV/JSON/TSV/Excel conversion, every Unicode text style,
generator determinism and SEO metadata completeness.

`npm run smoke` drives a real browser: it loads every route checking for console
errors, a rendered `h1`, a canonical link, a meta description and unique breadcrumb
URLs, then exercises the main interaction of every tool and asserts the output is
correct. Run it against `npm run dev` as well as `npm run preview` — React strips its
development warnings from production builds, so some classes of bug only surface in
dev:

```bash
SMOKE_BASE=http://localhost:5173 npm run smoke
```

## Legal note

Style guide names (APA, Chicago, AP, MLA, Bluebook, AMA), publication names
(The New York Times, Wikipedia) and game names (Scrabble, Words with Friends, Pokemon) are trademarks of their respective owners. This project is independent and
unaffiliated; the names are used only to describe compatibility.
