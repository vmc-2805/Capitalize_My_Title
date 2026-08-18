/**
 * Browser smoke test. Loads every route in headless Chromium, fails on any
 * console error or unhandled rejection, then drives the main interaction of
 * each significant tool and asserts that real output appears.
 *
 * Usage: npm run build && npm run preview  (in one shell)
 *        node scripts/smoke.mjs            (in another)
 * Or just: npm run smoke
 */

import { chromium } from 'playwright'

const BASE = process.env.SMOKE_BASE || 'http://localhost:4173'

const nav = await import(new URL('../src/data/navigation.js', import.meta.url))
const { POSTS } = await import(new URL('../src/data/posts.js', import.meta.url))

const routes = [...nav.ALL_PAGES.map((p) => p.path), ...POSTS.map((p) => `/blog/post/${p.slug}`)]

let passed = 0
let failed = 0
const problems = []

const record = (ok, label, detail = '') => {
  if (ok) {
    passed += 1
  } else {
    failed += 1
    problems.push(`${label}${detail ? ` — ${detail}` : ''}`)
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`)
  }
}

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })

/** Opens a page with console-error capture attached. */
async function open(path) {
  const page = await context.newPage()
  const errors = []
  page.on('console', (msg) => {
    // A site deployed without the optional title function serves 404 there by
    // design; the browser logs that as a console error, and the page falls
    // back to templates. Everything else counts.
    const optionalEndpoint = msg.text().includes('404') && msg.location()?.url?.includes('/api/generate')
    if (msg.type() === 'error' && !optionalEndpoint) errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('response', (res) => {
    // The title API is optional — a site deployed without the function serves
    // 404 there by design, and the page falls back to templates. Anything else
    // returning 4xx/5xx is a real fault.
    const optional = res.url().includes('/api/generate') && res.status() === 404
    if (res.status() >= 400 && !optional) errors.push(`HTTP ${res.status()} ${res.url()}`)
  })
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  return { page, errors }
}

/* ------------------------------------------------------------------ */
console.log(`\nRoute render check (${routes.length} routes)`)

for (const path of routes) {
  const { page, errors } = await open(path)
  const h1 = await page.locator('h1').first().textContent().catch(() => null)
  const title = await page.title()

  record(!!h1 && h1.trim().length > 0, `${path} renders an h1`)
  record(title.length > 10, `${path} has a title tag`, title)
  record(errors.length === 0, `${path} console clean`, errors[0])

  // Canonical and description must be present for SEO.
  const canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href').catch(() => null)
  const description = await page.locator('meta[name="description"]').first().getAttribute('content').catch(() => null)
  record(!!canonical, `${path} has a canonical link`)
  record(!!description && description.length > 50, `${path} has a meta description`)

  // A repeated URL in the trail is invalid structured data and a duplicate
  // React key, so it is checked on every page rather than spot-checked.
  const crumbs = await page.locator('nav[aria-label="Breadcrumb"] a, nav[aria-label="Breadcrumb"] li').evaluateAll(
    (nodes) => nodes.filter((n) => n.tagName === 'A').map((n) => n.getAttribute('href')),
  )
  record(new Set(crumbs).size === crumbs.length, `${path} breadcrumb URLs are unique`, crumbs.join(' , '))

  await page.close()
}

/* ------------------------------------------------------------------ */
console.log('\nNavigation')
{
  const { page, errors } = await open('/')
  const header = page.locator('header')
  await header.getByRole('button', { name: /^tools$/i }).click()
  const menuLink = header.getByRole('link', { name: 'CSV to JSON Converter' })
  record(await menuLink.isVisible(), 'Tools mega menu opens and shows a submenu item')

  await menuLink.click()
  await page.waitForURL('**/tools/csv-to-json')
  record(page.url().endsWith('/tools/csv-to-json'), 'Menu link navigates to the tool')

  // The URL updates before React commits the new render, so wait for the paint
  // rather than reading the class immediately.
  const toolsTab = header.getByRole('button', { name: /^tools$/i })
  await page
    .waitForFunction(
      () =>
        [...document.querySelectorAll('header button')]
          .find((b) => b.textContent.trim().toLowerCase().startsWith('tools'))
          ?.className.includes('border-brand-600'),
      null,
      { timeout: 5000 },
    )
    .catch(() => {})
  const toolsClass = (await toolsTab.getAttribute('class')) || ''
  record(toolsClass.includes('border-brand-600'), 'Header marks the section you are in', toolsClass.slice(-40))

  // The primary button must never point at the page you are already on.
  const cta = header.getByRole('link', { name: 'Capitalize a title' })
  record((await cta.getAttribute('href')) === '/', 'Header CTA points home from a tool page')

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  const homeCta = header.getByRole('link', { name: 'Browse all tools' })
  record((await homeCta.count()) === 1, 'Header CTA swaps on the homepage so it is never a dead link')
  record(errors.length === 0, 'Navigation console clean', errors[0])
  await page.close()
}

/* ------------------------------------------------------------------ */
console.log('\nTool interactions')

/**
 * Waits for text inside <main>. Uses textContent rather than innerText so CSS
 * `text-transform: uppercase` on labels does not break the match, and scopes to
 * main so FAQ copy mentioning the same phrase cannot satisfy it early.
 */
/**
 * Waits for the title list itself. The words "title ideas" also appear in the
 * Related tools descriptions, so waiting on that text matches at page load and
 * counts an empty list.
 */
const waitForTitles = (page, timeout = 45000) =>
  page.locator('main ul li:has-text("chars")').first().waitFor({ timeout })

/** The rendered list as one string, so two runs can be compared in full. */
const titleList = async (page) => (await page.locator('main ul li span').allTextContents()).join('|')

/**
 * Waits for the list to actually be replaced rather than for a fixed delay.
 * With a model API key set, generating takes seconds instead of microseconds,
 * so a sleep long enough for templates reads the old list.
 */
const waitForNewTitles = (page, previous, timeout = 45000) =>
  page.waitForFunction(
    (prev) => {
      const now = [...document.querySelectorAll('main ul li span')]
        .map((node) => node.textContent)
        .join('|')
      return now.length > 0 && now !== prev
    },
    previous,
    { timeout },
  )

const waitForMain = (page, needle, timeout = 45000) =>
  page.waitForFunction(
    (text) => document.querySelector('main')?.textContent?.includes(text),
    needle,
    { timeout },
  )

async function tool(path, label, run) {
  const { page, errors } = await open(path)
  try {
    await run(page)
    record(errors.length === 0, `${label} console clean`, errors[0])
  } catch (error) {
    record(false, label, error.message.split('\n')[0])
  } finally {
    await page.close()
  }
}

await tool('/', 'Homepage capitalizes a title', async (page) => {
  await page.locator('#title-input').fill('the quick brown fox jumps over the lazy dog')
  const output = await page.locator('output').first().textContent()
  record(
    output.trim() === 'The Quick Brown Fox Jumps Over the Lazy Dog',
    'Homepage APA title case output',
    output.trim(),
  )

  await page.getByRole('tab', { name: 'Chicago' }).click()
  const chicago = (await page.locator('output').first().textContent()).trim()
  record(chicago === 'The Quick Brown Fox Jumps over the Lazy Dog', 'Chicago tab changes the result', chicago)

  await page.getByRole('button', { name: 'UPPERCASE' }).click()
  const upper = (await page.locator('output').first().textContent()).trim()
  record(upper === upper.toUpperCase() && upper.length > 10, 'UPPERCASE button works', upper)

  const score = await page.getByText(/\/100/).first().isVisible()
  record(score, 'Headline score panel appears')
})

await tool('/tools/comma-separator', 'Comma separator', async (page) => {
  await page.locator('#cs-input').fill('apple\nbanana\ncherry')
  await page.waitForTimeout(150)
  record((await page.locator('#cs-output').inputValue()) === 'apple,banana,cherry', 'Comma separator joins a column')
  record((await page.locator('main').textContent()).includes('List items: 3'), 'It counts the list items')

  // Quotes, wrappers and the delimiter presets must all take effect.
  await page.getByRole('button', { name: 'Single' }).click()
  await page.waitForTimeout(120)
  record((await page.locator('#cs-output').inputValue()) === "'apple','banana','cherry'", 'Single quotes wrap each item')

  await page.getByRole('button', { name: 'Semicolon' }).click()
  await page.waitForTimeout(120)
  record((await page.locator('#cs-output').inputValue()).includes(';'), 'The semicolon preset changes the delimiter')
  record((await page.locator('#cs-delim').inputValue()) === '59', 'The delimiter box shows the character code')

  await page.getByRole('button', { name: 'None' }).click()
  await page.locator('#cs-item-prefix').fill('<li>')
  await page.locator('#cs-item-suffix').fill('</li>')
  await page.locator('#cs-list-prefix').fill('<ul>')
  await page.locator('#cs-list-suffix').fill('</ul>')
  await page.getByRole('button', { name: 'Comma' }).click()
  await page.waitForTimeout(150)
  const html = await page.locator('#cs-output').inputValue()
  record(html.startsWith('<ul><li>apple</li>') && html.endsWith('</ul>'), 'Item and list wrappers build an HTML list', html)

  // Every cleanup switch has to be present and wired up.
  for (const label of [
    'Lowercase list',
    'Reverse list',
    'Remove line breaks',
    'Remove paragraph breaks',
    'Remove extra spaces',
    'Remove all whitespace',
    'Remove duplicates',
  ]) {
    record((await page.getByLabel(label).count()) === 1, `Setting present: ${label}`)
  }

  await page.getByLabel('Remove duplicates').check()
  await page.locator('#cs-input').fill('a\na\nb')
  await page.waitForTimeout(150)
  record((await page.locator('main').textContent()).includes('List items: 2'), 'Remove duplicates takes effect')

  // The delimited box must convert back into a column.
  await page.locator('#cs-list-prefix').fill('')
  await page.locator('#cs-list-suffix').fill('')
  await page.locator('#cs-item-prefix').fill('')
  await page.locator('#cs-item-suffix').fill('')
  await page.locator('#cs-output').fill('one,two,three')
  await page.waitForTimeout(150)
  record((await page.locator('#cs-input').inputValue()) === 'one\ntwo\nthree', 'Editing the list rebuilds the column')
})

await tool('/tools/csv-to-json', 'CSV to JSON', async (page) => {
  await page.getByRole('button', { name: 'Load sample' }).click()
  await page.waitForTimeout(200)
  const out = await page.locator('#dc-output').inputValue()
  record(out.includes('"Ada Lovelace"'), 'CSV to JSON produces JSON')
  record(out.includes('"years": 12'), 'CSV to JSON types numbers')
  record((await page.locator('main').textContent()).includes('3 rows'), 'It reports the row count')

  // Every format pair the dropdowns offer must produce something.
  for (const to of ['csv', 'tsv', 'json']) {
    await page.locator('#dc-to').selectOption(to)
    await page.waitForTimeout(150)
    const text = await page.locator('#dc-output').inputValue()
    record(text.includes('Ada Lovelace'), `Converting to ${to} keeps the data`)
  }

  // Excel cannot be shown as text, so the box is replaced with a note.
  await page.locator('#dc-to').selectOption('excel')
  await page.waitForTimeout(150)
  record((await page.locator('#dc-output').count()) === 0, 'Excel output hides the text box')
  record((await page.locator('main').textContent()).includes('cannot be shown as text'), 'Excel output explains why')

  // The swap button reverses the direction and feeds the result back in.
  await page.locator('#dc-to').selectOption('json')
  await page.waitForTimeout(150)
  await page.getByRole('button', { name: 'Swap the two formats' }).click()
  await page.waitForTimeout(200)
  record((await page.locator('#dc-from').inputValue()) === 'json', 'Swap reverses the from format')
  record((await page.locator('#dc-to').inputValue()) === 'csv', 'Swap reverses the to format')
  record((await page.locator('#dc-input').inputValue()).trim().startsWith('['), 'Swap feeds the output back in')

  // Bad input reports the parser message rather than failing silently.
  await page.locator('#dc-input').fill('{oops')
  await page.waitForTimeout(200)
  record((await page.locator('main').textContent()).includes('could not be read'), 'Invalid input is reported')

  // Settings must all be present.
  await page.getByRole('button', { name: 'Settings' }).click()
  for (const label of [
    'Include header row',
    'Minify JSON',
    'Trim headings and values',
    'Surround non-numbers in quotes',
    'Remove empty trailing columns',
  ]) {
    record((await page.getByLabel(label).count()) === 1, `Setting present: ${label}`)
  }
  record((await page.locator('#dc-delim').count()) === 1, 'Delimiter setting present')
})

await tool('/tools/json-to-csv', 'JSON to CSV', async (page) => {
  record((await page.locator('#dc-from').inputValue()) === 'json', 'JSON to CSV page starts on JSON')
  record((await page.locator('#dc-to').inputValue()) === 'csv', 'JSON to CSV page targets CSV')

  await page.getByRole('button', { name: 'Load sample' }).click()
  await page.waitForTimeout(200)
  const out = await page.locator('#dc-output').inputValue()
  record(out.startsWith('name,role,years'), 'JSON to CSV writes a header row', out.slice(0, 40))
  record(out.includes('Ada Lovelace'), 'JSON to CSV keeps the values')
})

await tool('/tools/uppercase-to-lowercase', 'Uppercase to lowercase', async (page) => {
  await page.locator('#ul-input').fill('HELLO WORLD FROM NASA')
  const out = await page.locator('.whitespace-pre-wrap').first().textContent()
  record(out.trim() === 'hello world from nasa', 'Lowercase conversion', out.trim())
  await page.getByRole('button', { name: 'Sentence case' }).click()
  const sentence = (await page.locator('.whitespace-pre-wrap').first().textContent()).trim()
  record(sentence === 'Hello world from NASA', 'Sentence case keeps the acronym', sentence)
})

await tool('/tools/ai-title-generator', 'AI title generator', async (page) => {
  const empty = await page.locator('main').textContent()
  record(empty.includes('Click the "Get Titles" button'), 'Shows the empty-state prompt before any click')

  await page.locator('#tg-topic').fill('remote onboarding')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForTitles(page)
  const count = await page.locator('main ul li:has-text("chars")').count()
  record(count >= 10, 'Title generator produces a list', `${count} items`)

  // Pressing the button again must give a genuinely different set. Comparing
  // the whole list rather than one title avoids a coincidental match.
  const first = await titleList(page)
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForNewTitles(page, first)
  const second = await titleList(page)
  record(first !== second, 'Get Titles again produces new titles')

  // The Use dropdown must switch the whole template family.
  await page.locator('#tg-use').selectOption('poem')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForNewTitles(page, second)
  const poemish = await titleList(page)
  record(poemish !== second, 'Changing Use changes the results')

  // Reset must clear the results, the input and every option.
  await page.locator('#tg-tone').selectOption('funny')
  await page.getByRole('button', { name: 'Reset' }).click()
  await page.waitForTimeout(200)

  record((await page.locator('#tg-topic').inputValue()) === '', 'Reset clears the input box')
  record((await page.locator('#tg-tone').inputValue()) === 'standard', 'Reset puts Tone back to Standard')
  record((await page.locator('#tg-use').inputValue()) === 'blog', 'Reset puts Use back to its default')
  const afterReset = await page.locator('main').textContent()
  record(afterReset.includes('Click the "Get Titles" button'), 'Reset clears the results')

  // The panel must hold only what the reference tool offers.
  for (const id of ['#tg-tone', '#tg-use']) {
    record((await page.locator(id).count()) === 1, `Option present: ${id}`)
  }
  for (const id of ['#tg-kw', '#tg-count', '#tg-style']) {
    record((await page.locator(id).count()) === 0, `Extra input removed: ${id}`)
  }
  record(await page.getByRole('button', { name: 'Reset' }).isDisabled(), 'Reset disables itself once everything is clean')
})

await tool('/tools/book-title-generator', 'Book title generator', async (page) => {
  await page.locator('#tg-genre').selectOption('thriller')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForTitles(page)
  const thriller = await titleList(page)

  await page.locator('#tg-genre').selectOption('romance')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForNewTitles(page, thriller)
  const romance = await titleList(page)
  record(thriller !== romance, 'Genre changes the generated titles')

  // Reset has to put this page's own dropdown back too.
  await page.getByRole('button', { name: 'Reset' }).click()
  await page.waitForTimeout(200)
  record((await page.locator('#tg-genre').inputValue()) === 'any', 'Reset puts Genre back to Any')
})

await tool('/tools/poem-title-generator', 'Poem title generator', async (page) => {
  await page.locator('#tg-poem-type').selectOption('ode')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForTitles(page)
  const ode = await titleList(page)

  // The wiring is what is asserted, not a literal word: the templates put
  // "Ode" in every line, but a model writes to the form without naming it.
  await page.locator('#tg-poem-type').selectOption('haiku')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForNewTitles(page, ode)
  record((await titleList(page)) !== ode, 'Poem type changes the generated titles')
})

await tool('/tools/essay-title-generator', 'Essay title generator', async (page) => {
  await page.locator('#tg-essay-grade').selectOption('elementary')
  await page.locator('#tg-topic').fill('water pollution')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForTitles(page)
  const simple = await titleList(page)

  await page.locator('#tg-essay-grade').selectOption('graduate')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForNewTitles(page, simple)
  const formal = await titleList(page)
  record(simple !== formal, 'Essay grade changes the titles')
})

await tool('/tools/youtube-title-generator', 'YouTube title generator', async (page) => {
  await page.locator('#tg-topic').fill('standing desk build')
  await page.locator('#tg-tone').selectOption('clickbait')
  await page.getByRole('button', { name: 'Get Titles' }).click()
  await waitForTitles(page)
  const count = await page.locator('main ul li:has-text("chars")').count()
  record(count >= 10, 'YouTube generator produces a list', `${count} items`)

  const optionsPanel = page.getByRole('button', { name: 'Options' })
  await optionsPanel.click()
  const hidden = await page.locator('#tg-tone').isVisible()
  record(!hidden, 'Options panel collapses')
})

await tool('/tools/ai-title-rewriter', 'Title rewriter', async (page) => {
  await page.locator('#tr-title').fill('Some really useful tips for editing your writing')
  await page.waitForSelector('text=rewrites')
  const body = await page.locator('main').textContent()
  record(body.includes('SEO-focused'), 'Rewriter shows the SEO angle')
  record(body.includes('Listicle'), 'Rewriter shows the listicle angle')

  await page.locator('#tr-kw').fill('editing')
  await page.getByRole('button', { name: 'Reset' }).click()
  await page.waitForTimeout(200)
  record((await page.locator('#tr-title').inputValue()) === '', 'Rewriter reset clears the title')
  record((await page.locator('#tr-kw').inputValue()) === '', 'Rewriter reset clears the keyword')
  const cleared = await page.locator('main').textContent()
  record(cleared.includes('Paste your title in the box above'), 'Rewriter reset clears the results')
})

await tool('/tools/lorem-ipsum-generator', 'Lorem ipsum', async (page) => {
  const out = await page.locator('pre').first().textContent()
  record(out.startsWith('Lorem ipsum'), 'Lorem ipsum starts correctly')
  record(out.split('\n\n').length === 3, 'Three paragraphs by default')
})

await tool('/tools/bold-text-generator', 'Bold text', async (page) => {
  await page.locator('#bt-input').fill('hello')
  const body = await page.locator('main').textContent()
  record(body.includes('𝐡𝐞𝐥𝐥𝐨'), 'Bold Unicode output rendered')

  // Every style the reference tool offers has to be on the page, including the
  // three that live outside the bold/italic/technical groups.
  record(body.includes('ollǝɥ'), 'Upside down style present')
  record(body.includes('ⓗⓔⓛⓛⓞ'), 'Bubble style present')
  record(body.includes('olleh'), 'Backwards style present')
  record(body.includes('ʰᵉˡˡᵒ'), 'Small (superscript) style present')
  record(body.includes('ʜᴇʟʟᴏ'), 'Small caps style present')
  record(body.includes('𝓱𝓮𝓵𝓵𝓸'), 'Bold cursive style present')
})

await tool('/tools/bubble-text-generator', 'Bubble text', async (page) => {
  await page.locator('#bb-input').fill('hi')
  const body = await page.locator('main').textContent()
  record(body.includes('ⓗⓘ'), 'Bubble Unicode output rendered')
})

await tool('/tools/wingdings-translator', 'Wingdings', async (page) => {
  await page.locator('#wd-input').fill('abc')
  const body = await page.locator('main').textContent()
  record(body.includes('✏'), 'Wingdings symbols rendered')
  record(body.includes('𝔞𝔟𝔠'), 'Gothic style rendered in the gallery')
  record(body.includes('ⓐⓑⓒ'), 'Bubble style rendered in the gallery')

  const rows = await page.locator('main ul li').filter({ has: page.getByRole('button', { name: /Copy/ }) }).count()
  record(rows >= 40, 'Gallery shows 40+ styles', `${rows}`)

  await page.getByRole('button', { name: 'Symbols → Text' }).click()
  await page.locator('#wd-input').fill('✏✂✁')
  const decoded = await page.locator('main .whitespace-pre-wrap').first().textContent()
  record(decoded.trim() === 'abc', 'Symbols translate back to English', decoded.trim())
})

await tool('/tools/text-repeater', 'Text repeater', async (page) => {
  await page.locator('#tr-text').fill('ab')
  await page.locator('#tr-times').fill('3')
  const out = await page.locator('.whitespace-pre-wrap').first().textContent()
  record(out.trim().split('\n').length === 3, 'Repeats the requested number of times')
})

await tool('/tools/character-name-generator', 'Character names', async (page) => {
  // Nothing is generated until the button is pressed, so the empty state is
  // what a visitor sees first.
  const before = await page.locator('main').textContent()
  record(before.includes('Press “Generate names”'), 'Waits for the button before showing names')
  record((await page.locator('main ul li button').count()) === 0, 'No names on the page before generating')

  await page.getByRole('button', { name: 'Generate names' }).click()
  const count = await page.locator('main ul li button').count()
  record(count >= 12, 'Twelve names generated', `${count}`)

  const first = await page.locator('main ul li button').first().textContent()
  await page.getByRole('button', { name: 'Generate again' }).click()
  const after = await page.locator('main ul li button').first().textContent()
  record(first !== after, 'Generate again produces new names')

  // All four choices sit on the page rather than inside a dropdown.
  const genders = page.locator('[role="radiogroup"] label')
  record((await genders.count()) === 4, 'Gender shows all four choices at once', `${await genders.count()}`)
  record(
    (await genders.allTextContents()).join('|') === 'Any|Male|Female|Non-binary',
    'Gender options match the reference, in order',
    (await genders.allTextContents()).join('|'),
  )

  await page.getByText('Female', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate again' }).click()
  const feminine = await page.locator('main ul li button').first().textContent()
  await page.getByText('Non-binary', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate again' }).click()
  const neutral = await page.locator('main ul li button').first().textContent()
  record(feminine !== neutral, 'Gender actually changes the names', `${feminine} vs ${neutral}`)

  await page.getByRole('button', { name: 'Reset' }).click()
  const cleared = await page.locator('main').textContent()
  record(cleared.includes('Press “Generate names”'), 'Reset puts the empty state back')
  record(
    (await page.locator('[role="radiogroup"] input:checked').getAttribute('value')) === 'any',
    'Reset puts Gender back to Any',
  )
})

await tool('/tools/random-state-generator', 'Random state', async (page) => {
  await page.locator('#rs-count').fill('5')
  record((await page.getByText('Capital:', { exact: false }).count()) === 0, 'No states before generating')
  await page.getByRole('button', { name: 'Draw states' }).click()
  const count = await page.getByText('Capital:', { exact: false }).count()
  record(count === 5, 'Five states drawn', `${count}`)
})

await tool('/tools/fortune-cookie-generator', 'Fortune cookie', async (page) => {
  const before = await page.locator('main').textContent()
  record(!before.includes('Lucky numbers'), 'No fortune before the button is pressed')
  await page.getByRole('button', { name: 'Crack a cookie' }).click()
  const body = await page.locator('main').textContent()
  record(body.includes('Lucky numbers'), 'Fortune shows lucky numbers')
})

await tool('/tools/character-backstory-generator', 'Backstory', async (page) => {
  await page.getByRole('button', { name: 'Write the backstory' }).click()
  const body = await page.locator('main').textContent()
  record(body.includes('Turning point'), 'Backstory shows the six beats')
})

await tool('/tools/pokemon-name-generator', 'Pokemon names', async (page) => {
  record(
    (await page.locator('main').textContent()).includes('Press “Generate names”'),
    'Waits for the button before showing names',
  )

  // Every control the reference tool offers is on the page.
  record((await page.locator('[name="pk-gender"]').count()) === 4, 'Gender offers four choices')
  record((await page.locator('[name="pk-fake"]').count()) === 2, 'Fake name offers Yes and No')
  record((await page.locator('#pk-type option').count()) === 13, 'Type offers Any plus every type')

  // A chosen type must drive the name, not just label it.
  await page.locator('#pk-type').selectOption('Ice')
  await page.locator('#pk-count').fill('8')
  await page.getByRole('button', { name: 'Generate names' }).click()
  const chips = await page.locator('main ul li .chip').allTextContents()
  record(chips.length === 8 && chips.every((c) => c === 'Ice'), 'Choosing a type applies it to every name', chips.join())

  const invented = await page.locator('main ul li button span').first().textContent()

  // Fake name off must give words a person can actually read.
  await page.getByText('No', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate again' }).click()
  const plain = await page.locator('main ul li button span').first().textContent()
  record(invented !== plain, 'Turning off fake names changes the result', `${invented} vs ${plain}`)

  await page.getByText('Female', { exact: true }).click()
  await page.getByRole('button', { name: 'Generate again' }).click()
  const feminine = await page.locator('main ul li button span').first().textContent()
  record(feminine !== plain, 'Gender changes the ending', `${plain} vs ${feminine}`)

  // The names are offered as free to use, so a real one must never appear.
  const all = (await page.locator('main ul li button span').allTextContents()).map((n) => n.toLowerCase())
  const taken = ['charmander', 'bulbasaur', 'vaporeon', 'onix', 'glaceon']
  record(!all.some((n) => taken.includes(n)), 'No trademarked name is handed out', all.join())
})

await tool('/tools/speech-generator', 'Speech generator', async (page) => {
  const before = await page.locator('main').textContent()
  record(before.includes('Press “Write the speech”'), 'Waits for the button before writing')

  await page.locator('#sp-topic').fill('why our onboarding is broken')
  await page.locator('#sp-occasion').selectOption('a team all-hands')
  await page.locator('#sp-min').fill('2')
  await page.getByRole('button', { name: 'Write the speech' }).click()

  // This tool calls the model when a key is configured, so the wait has to
  // allow for a network round trip rather than a render.
  const output = page.locator('main pre').first()
  await output.waitFor({ timeout: 45000 })
  const speech = await output.textContent()
  const words = speech.trim().split(/\s+/).length
  record(words > 80, 'Writes a speech of real length', `${words} words`)
  record(speech.includes('\n\n'), 'The speech is broken into paragraphs')

  // The stage-direction and label habits the prompt rules out.
  record(!/\bPoint \d\b/.test(speech), 'No "Point 1" scaffolding is left in', speech.slice(0, 60))
  record(!speech.includes('['), 'No bracketed stage directions', speech.slice(0, 60))

  await page.getByRole('button', { name: 'Reset' }).click()
  const cleared = await page.locator('main').textContent()
  record(cleared.includes('Press “Write the speech”'), 'Reset puts the empty state back')
})

await tool('/tools/prompt-generator', 'Prompt generator', async (page) => {
  const before = await page.locator('main').textContent()
  record(before.includes('Press “Generate prompts”'), 'Waits for the button before showing prompts')

  await page.locator('#pg-subject').fill('customer onboarding')
  await page.locator('#pg-count').fill('4')
  await page.getByRole('button', { name: 'Generate prompts' }).click()

  // This tool calls the model when a key is configured, so the wait has to
  // allow for a network round trip rather than a render.
  await page.locator('main ul li p').first().waitFor({ timeout: 45000 })
  const items = await page.locator('main ul li p').allTextContents()
  record(items.length === 4, 'Generates the number of prompts asked for', `${items.length}`)
  record(
    items.every((t) => t.trim().length > 20),
    'Every prompt has real content',
  )

  await page.getByRole('button', { name: 'Reset' }).click()
  const cleared = await page.locator('main').textContent()
  record(cleared.includes('Press “Generate prompts”'), 'Reset puts the empty state back')
  record((await page.locator('#pg-subject').inputValue()) === '', 'Reset clears the subject')

  // The four-part explainer was removed; the page must not still describe it.
  record(!cleared.includes('The four-part prompt'), 'The four-part section is gone')
})

/*
 * While the model is being called there must be visible feedback, otherwise a
 * two-second wait reads as a dead button. The endpoint is deliberately slowed
 * here so the in-between state can be inspected at all — it is too brief to
 * catch reliably otherwise.
 */
await tool('/tools/prompt-generator', 'Prompt generator loader', async (page) => {
  await page.route('**/api/generate', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })

  await page.locator('#pg-subject').fill('customer onboarding')
  await page.getByRole('button', { name: 'Generate prompts' }).click()

  // The loader must be the very next thing on screen. An earlier version set
  // the busy flag inside an effect, so for one render the page showed an empty
  // results box — which reads as "it finished and found nothing".
  const emptyBox = await page.locator('main ul li p').count()
  record(emptyBox === 0, 'No empty result box flashes before the loader', `${emptyBox}`)

  const status = page.locator('[role="status"]')
  await status.waitFor({ timeout: 5000 })
  record((await status.textContent()).includes('Writing your prompts'), 'Loader names what it is doing')
  record((await page.locator('[role="status"] svg.animate-spin').count()) === 1, 'Loader shows a spinner')
  record((await page.locator('[role="status"] .animate-pulse').count()) > 0, 'Loader holds space for the results')
  record(
    await page.getByRole('button', { name: 'Working…' }).isDisabled(),
    'The button says it is working and cannot be pressed twice',
  )

  await page.locator('main ul li p').first().waitFor({ timeout: 45000 })
  record((await page.locator('[role="status"]').count()) === 0, 'Loader goes away once the prompts arrive')
})

await tool('/tools/ai-title-generator', 'Title generator loader', async (page) => {
  await page.route('**/api/generate', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    await route.continue()
  })

  await page.locator('#tg-topic').fill('remote onboarding')
  await page.getByRole('button', { name: 'Get Titles' }).click()

  const status = page.locator('[role="status"]')
  await status.waitFor({ timeout: 5000 })
  record((await status.textContent()).includes('Writing your titles'), 'Titles loader names what it is doing')
  record((await page.locator('[role="status"] svg.animate-spin').count()) === 1, 'Titles loader shows a spinner')

  await waitForTitles(page)
  record((await page.locator('[role="status"]').count()) === 0, 'Titles loader goes away once they arrive')
})

await tool('/tools', 'All tools index', async (page) => {
  const before = await page.locator('main ul li a').count()

  // The cards here must use the same link treatment as the related-tools strip.
  const firstCard = page.locator('main ul li a').first()
  record((await firstCard.textContent()).includes('Open this tool'), 'All Tools cards carry the open label')
  const href = await firstCard.getAttribute('href')
  record(!!href && href.startsWith('/tools/'), 'All Tools cards link to a real tool', href)

  await page.getByLabel('Search tools').fill('csv')
  const after = await page.locator('main ul li a').count()
  record(after > 0 && after < before, 'Tool search filters the list', `${before} → ${after}`)

  await page.getByLabel('Search tools').fill('zzzznothing')
  const empty = await page.locator('main ul li a').count()
  record(empty === 0, 'Tool search shows nothing for an unknown term', `${empty}`)
})

await tool('/blog', 'Blog index', async (page) => {
  const count = await page.locator('main article').count()
  record(count >= 9, 'All posts listed', `${count}`)
  await page.locator('main article h3 a').first().click()
  await page.waitForURL('**/blog/post/**')
  const body = await page.locator('main').textContent()
  record(body.length > 2000, 'Post body renders')
})

/* ------------------------------------------------------------------ */
console.log('\nRelated tools')
try {
  const { page, errors } = await open('/tools/comma-separator')
  const section = page.locator('section[aria-labelledby="related-heading"]')
  const cards = section.locator('ul li a')

  record((await cards.count()) >= 3, 'Related tools shows a set of links')
  record(
    (await section.textContent()).includes('Click any card below to open that tool'),
    'Related tools explains that the cards are clickable',
  )

  const first = cards.first()
  record((await first.textContent()).includes('Open this tool'), 'Each card carries an explicit open label')
  record(!!(await first.getAttribute('href')), 'Each card is a real link with an href')

  const href = await first.getAttribute('href')
  await first.click()
  await page.waitForURL(`**${href}`)
  record(page.url().endsWith(href), 'Clicking a related tool opens it', page.url())
  record(errors.length === 0, 'Related tools console clean', errors[0])
  await page.close()
} catch (error) {
  // One broken block must not abort the whole suite.
  record(false, 'Related tools', error.message.split('\n')[0])
}

/* ------------------------------------------------------------------ */
console.log('\nReset buttons')

/**
 * Every tool that produces output should offer a Reset. This walks each one,
 * changes something, and checks the button clears it and then disables itself.
 */
const RESET_TOOLS = [
  { path: '/tools/comma-separator', field: '#cs-input', value: 'apple\nbanana' },
  { path: '/tools/csv-to-json', field: '#dc-to', value: 'tsv', select: true },
  { path: '/tools/json-to-csv', field: '#dc-to', value: 'tsv', select: true },
  { path: '/tools/uppercase-to-lowercase', field: '#ul-input', value: 'HELLO' },
  { path: '/tools/square-image', field: '#si-size', value: '512', select: true },
  { path: '/tools/lorem-ipsum-generator', field: '#li-count', value: '7' },
  { path: '/tools/wingdings-translator', field: '#wd-input', value: 'hello' },
  { path: '/tools/bold-text-generator', field: '#bt-input', value: 'hello' },
  { path: '/tools/bubble-text-generator', field: '#bb-input', value: 'hello' },
  { path: '/tools/fortune-cookie-generator', field: '#fc-batch', value: '4' },
  { path: '/tools/invisible-character', field: '#ic-repeat', value: '5' },
  { path: '/tools/random-state-generator', field: '#rs-count', value: '5' },
  { path: '/tools/prompt-generator', field: '#pg-subject', value: 'onboarding' },
  { path: '/tools/text-repeater', field: '#tr-text', value: 'ab' },
  { path: '/tools/speech-generator', field: '#sp-topic', value: 'onboarding' },
  { path: '/tools/song-generator', field: '#sg-theme', value: 'a harbour' },
  { path: '/tools/poem-generator', field: '#pm-theme', value: 'winter' },
  { path: '/tools/character-backstory-generator', field: '#bs-name', value: 'Wren' },
  { path: '/tools/character-name-generator', field: '#ng-count', value: '5' },
  { path: '/tools/name-generator', field: '#ng-start', value: 'a' },
  { path: '/tools/pokemon-name-generator', field: '#pk-count', value: '5' },
]

for (const item of RESET_TOOLS) {
  const { page, errors } = await open(item.path)
  try {
    const resetButton = page.getByRole('button', { name: 'Reset' })
    record((await resetButton.count()) === 1, `${item.path} has a Reset button`)
    record(await resetButton.isDisabled(), `${item.path} Reset starts disabled`)

    const control = page.locator(item.field)
    const before = await control.inputValue()
    if (item.select) await control.selectOption(item.value)
    else await control.fill(item.value)

    record(!(await resetButton.isDisabled()), `${item.path} Reset wakes up after a change`)
    await resetButton.click()
    await page.waitForTimeout(150)

    record((await control.inputValue()) === before, `${item.path} Reset restores the control`, await control.inputValue())
    record(await resetButton.isDisabled(), `${item.path} Reset disables itself again`)
    record(errors.length === 0, `${item.path} reset console clean`, errors[0])
  } catch (error) {
    record(false, `${item.path} reset`, error.message.split('\n')[0])
  } finally {
    await page.close()
  }
}

/* ------------------------------------------------------------------ */
console.log('\nMisc')

await tool('/this-route-does-not-exist', '404 page', async (page) => {
  const body = await page.locator('main').textContent()
  record(body.includes('404'), '404 page renders for an unknown route')
})

/* ------------------------------------------------------------------ */
console.log('\nMobile layout')
{
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await mobile.newPage()
  const errors = []
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })

  const header = page.locator('header')
  await header.getByRole('button', { name: 'Open menu' }).click()
  await header.getByRole('button', { name: 'Converters' }).click()
  record(
    await header.getByRole('link', { name: 'CSV to JSON Converter' }).isVisible(),
    'Mobile menu opens a submenu',
  )

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)
  record(!overflow, 'No horizontal overflow on mobile')
  record(errors.length === 0, 'Mobile console clean', errors[0])
  await mobile.close()
}

await browser.close()

console.log(`\n${passed} passed, ${failed} failed`)
if (problems.length) {
  console.log('\nProblems:')
  for (const problem of problems) console.log(` - ${problem}`)
}
if (failed) process.exitCode = 1
