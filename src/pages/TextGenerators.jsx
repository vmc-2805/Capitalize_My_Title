import { useMemo, useState } from 'react'
import ToolShell from '../components/ToolShell.jsx'
import {
  CopyButton,
  DownloadButton,
  Field,
  Icon,
  NumberInput,
  OutputBox,
  ResetButton,
  Select,
  Toggle,
  resetControls,
  useCopy,
} from '../components/ui.jsx'
import { generateLorem } from '../lib/generators.js'
import { newSeed } from '../lib/random.js'
import { ALL_TEXT_STYLES, TEXT_DECORATORS, UNICODE_STYLES, toUnicodeStyle } from '../lib/unicode.js'

/* ================================================================== */
/* Lorem Ipsum Generator                                               */
/* ================================================================== */

export function LoremIpsum() {
  const [unit, setUnit] = useState('paragraphs')
  const [count, setCount] = useState(3)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [html, setHtml] = useState(false)
  const [seed, setSeed] = useState(1)

  const output = useMemo(
    () => generateLorem({ unit, count, startWithLorem, html, seed }),
    [unit, count, startWithLorem, html, seed],
  )

  const { dirty, reset } = resetControls([
    [unit, setUnit, 'paragraphs'],
    [count, setCount, 3],
    [startWithLorem, setStartWithLorem, true],
    [html, setHtml, false],
    [seed, setSeed, 1],
  ])

  return (
    <ToolShell
      path="/tools/lorem-ipsum-generator"
      howTo={{
        steps: [
          'Choose what you need: paragraphs, sentences, words or list items.',
          'Set how many of them you want.',
          'Turn on HTML if you want <code>&lt;p&gt;</code> or <code>&lt;ul&gt;</code> tags around the text.',
          'Copy the text, or download it as a file.',
        ],
      }}
      faqs={[
        {
          q: 'What is lorem ipsum?',
          a: 'It is mixed-up Latin, taken from a text written by Cicero around 45 BC. Printers have used it as dummy text since the 1500s. It looks like real language but cannot be read, so people judge the design instead of reading the words.',
        },
        {
          q: 'Why not use "content content content" instead?',
          a: 'Repeated words give you unnatural word lengths and line breaks. So the layout you approve is not the layout you will actually get. Lorem ipsum has roughly the same mix of short and long words as real writing, and that is the whole point of it.',
        },
        {
          q: 'Should I use lorem ipsum in a real design?',
          a: 'For layout and font work, yes. For anything a client or manager will review, no. Dummy text hides the fact that the real content may not fit, and it lets everyone delay content decisions until it is too late to change the design.',
        },
        {
          q: 'Can I generate HTML-ready placeholder text?',
          a: 'Yes. Turn on HTML and each paragraph comes wrapped in a p tag, or each list in a ul with li items. You can paste it straight into your template.',
        },
      ]}
      about={`
        <h2>Where lorem ipsum comes from</h2>
        <p>The text comes from a book on ethics that Cicero wrote in 45 BC. The famous opening, "Lorem ipsum dolor sit amet", is a broken piece of "dolorem ipsum quia dolor sit amet", which means "pain itself, because it is pain". A printer mixed up the words in the 1500s to show off his fonts, and the printing world has used the mixed-up version ever since.</p>
        <h2>How much text should you generate?</h2>
        <ul>
          <li><strong>Main heading paragraph</strong> — 20 to 30 words.</li>
          <li><strong>Card description</strong> — one or two sentences.</li>
          <li><strong>Body section</strong> — three to five paragraphs.</li>
          <li><strong>Full article mockup</strong> — 10 to 15 paragraphs, so you can see how the page behaves when you scroll.</li>
        </ul>
      `}
    >
      <div className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Generate" htmlFor="li-unit">
          <Select
            id="li-unit"
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'paragraphs', label: 'Paragraphs' },
              { value: 'sentences', label: 'Sentences' },
              { value: 'words', label: 'Words' },
              { value: 'lists', label: 'Bullet lists' },
            ]}
          />
        </Field>
        <Field label="How many" htmlFor="li-count">
          <NumberInput id="li-count" value={count} onChange={setCount} min={1} max={200} />
        </Field>
        <div className="flex flex-col justify-center gap-2">
          <Toggle checked={startWithLorem} onChange={setStartWithLorem} label='Start with "Lorem ipsum"' />
          <Toggle checked={html} onChange={setHtml} label="Wrap in HTML tags" />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <button type="button" className="btn-primary" onClick={() => setSeed(newSeed())}>
            <Icon.refresh />
            Regenerate
          </button>
          <ResetButton reset={reset} dirty={dirty} />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="label mb-0">Placeholder text</span>
          <span className="text-xs text-ink-500">
            {output.trim().split(/\s+/).length} words · {output.length} characters
          </span>
        </div>
        <pre className="max-h-[480px] overflow-auto rounded-lg border border-gray-200 bg-white p-4 text-[15px] leading-7 whitespace-pre-wrap text-ink-900">
          {output}
        </pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton value={output} label="Copy text" className="btn-primary" />
          <DownloadButton value={output} filename={html ? 'lorem.html' : 'lorem.txt'} mime={html ? 'text/html' : 'text/plain'} />
        </div>
      </div>
    </ToolShell>
  )
}

/* ================================================================== */
/* Shared Unicode style renderer                                       */
/* ================================================================== */

function StyleGallery({ text, styles, columns = 1 }) {
  const { copy } = useCopy()
  const [copiedKey, setCopiedKey] = useState(null)

  const onCopy = (key, value) => {
    copy(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600)
  }

  return (
    <ul className={`grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {styles.map((style) => {
        const value = style.render(text)
        return (
          <li key={style.key} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">{style.label}</p>
              <p className="mt-1 line-clamp-2 text-lg break-words text-ink-900" title={value}>
                {value || <span className="text-gray-400">Type something above</span>}
              </p>
            </div>
            <button
              type="button"
              className={copiedKey === style.key ? 'btn-primary shrink-0' : 'btn-secondary shrink-0'}
              onClick={() => onCopy(style.key, value)}
              disabled={!value}
            >
              {copiedKey === style.key ? <Icon.check /> : <Icon.copy />}
              {copiedKey === style.key ? 'Copied' : 'Copy'}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const asGalleryStyle = (s) => ({
  key: s.key,
  label: s.label,
  render: (text) => toUnicodeStyle(text, s.key),
})

const styleGroup = (groupName) => UNICODE_STYLES.filter((s) => s.group === groupName).map(asGalleryStyle)

/** Picks named styles, in the order given, from either of the two style tables. */
const stylesNamed = (...keys) =>
  keys
    .map((key) => {
      const letters = UNICODE_STYLES.find((s) => s.key === key)
      return letters ? asGalleryStyle(letters) : TEXT_DECORATORS.find((d) => d.key === key)
    })
    .filter(Boolean)

/* ================================================================== */
/* Wingdings Translator                                                */
/* ================================================================== */

export function WingdingsTranslator() {
  const [text, setText] = useState('')
  const [direction, setDirection] = useState('toSymbols')

  // Reverse lookup: symbol → letter, built from the same maps.
  const decoded = useMemo(() => {
    if (direction !== 'toText') return ''
    const reverse = new Map()
    for (const key of ['wingdings', 'webdings']) {
      const style = UNICODE_STYLES.find((s) => s.key === key)
      for (const [letter, symbol] of Object.entries(style.map)) {
        if (!reverse.has(symbol)) reverse.set(symbol, letter)
      }
    }
    return [...text].map((ch) => reverse.get(ch) ?? ch).join('')
  }, [text, direction])

  const { dirty, reset } = resetControls([
    [text, setText, ''],
    [direction, setDirection, 'toSymbols'],
  ])

  return (
    <ToolShell
      path="/tools/wingdings-translator"
      howTo={{
        steps: [
          'Type or paste your text into the box at the top.',
          'Every style below updates as you type — Wingdings and Webdings first, then 40+ other fancy text styles.',
          'Click Copy next to the style you want.',
          'Paste it anywhere — the output uses real Unicode characters, not a font, so it travels.',
          'To go the other way, switch the direction to <strong>Symbols → Text</strong> and paste your symbols.',
        ],
      }}
      faqs={[
        {
          q: 'Is this real Wingdings?',
          a: 'These are the Unicode versions of each Wingdings symbol. Real Wingdings is a font, so the symbols only show if the other person has that font installed. Unicode characters are part of the text itself, so they survive copy and paste into any app.',
        },
        {
          q: 'Why does the output look different on my phone?',
          a: 'Every device draws these symbols using its own font. Apple, Google and Microsoft each draw them a little differently. Some appear as colourful emoji on a phone and as simple line drawings on a computer.',
        },
        {
          q: 'Can I translate Wingdings back into English?',
          a: 'Yes. Switch the direction to Symbols → Text and paste your symbols. Anything that is not a Wingdings or Webdings symbol is left exactly as it is.',
        },
        {
          q: 'Where did the Wingdings conspiracy theory come from?',
          a: 'In 1992 people noticed that some letter combinations in Wingdings gave a row of unlucky-looking symbols. Microsoft changed those characters in later versions. It was only a coincidence — Wingdings was put together from older symbol collections, letter by letter.',
        },
      ]}
      about={`
        <h2>Wingdings and Webdings</h2>
        <p>Wingdings came with Windows 3.1 in 1992. It was put together from three older symbol fonts. Webdings came in 1997 for Internet Explorer 4, and was meant for web icons: arrows, media buttons and weather symbols. Both replace ordinary letters with pictures, which is why typing your name gives you a row of unrelated symbols.</p>
        <h2>Unicode replaced them</h2>
        <p>Most Wingdings symbols now have their own Unicode characters, added mainly between 2010 and 2014 to support emoji. That is what this translator uses. The difference matters: a Unicode symbol is a real character, so it can be copied, searched and read out by a screen reader. A Wingdings symbol is just an ordinary letter wearing a costume.</p>
        <h2>The other styles on this page</h2>
        <p>The same idea gives you every other style below. Unicode has dozens of complete alternative alphabets — bold, gothic, double struck, bubble, square, wide — plus marks that draw a line through or under the letter before them. None of it is a font, so it survives when you paste it into an Instagram bio, a WhatsApp message or a username box that removes formatting.</p>
        <h2>Which styles are safest to use</h2>
        <ul>
          <li><strong>Works almost everywhere:</strong> bold, italic, small caps, bubble, wide.</li>
          <li><strong>Usually fine:</strong> gothic, cursive, double struck, square, mono.</li>
          <li><strong>Sometimes broken on older Android phones:</strong> black bubble, black square, emoji letters.</li>
          <li><strong>Use less often:</strong> cursed, fireworks, stinky and seagull stack extra marks on each letter. Some apps cut them, and screen readers read them out letter by letter.</li>
        </ul>
      `}
    >
      <div className="mb-4 flex gap-2">
        {[
          { key: 'toSymbols', label: 'Text → Symbols' },
          { key: 'toText', label: 'Symbols → Text' },
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            className={direction === option.key ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setDirection(option.key)}
          >
            {option.label}
          </button>
        ))}
        <span className="ml-auto">
          <ResetButton reset={reset} dirty={dirty} />
        </span>
      </div>

      <Field label={direction === 'toSymbols' ? 'Your text' : 'Wingdings or Webdings symbols'} htmlFor="wd-input">
        <textarea
          id="wd-input"
          rows={3}
          className="field text-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={direction === 'toSymbols' ? 'Hello world' : 'Paste symbols here'}
        />
      </Field>

      <div className="mt-5">
        {direction === 'toSymbols' ? (
          <>
            <h2 className="mb-3 text-sm font-bold text-ink-900">
              {ALL_TEXT_STYLES.length} styles — tap Copy on any of them
            </h2>
            <StyleGallery text={text} styles={ALL_TEXT_STYLES} />
          </>
        ) : (
          <Field label="Decoded text">
            <OutputBox value={decoded} rows={3} />
          </Field>
        )}
      </div>
    </ToolShell>
  )
}

/* ================================================================== */
/* Bold Text Generator                                                 */
/* ================================================================== */

export function BoldTextGenerator() {
  const [text, setText] = useState('')

  const { dirty, reset } = resetControls([[text, setText, '']])

  const groups = useMemo(
    () => [
      { title: 'Bold and italic', styles: styleGroup('Bold & italic') },
      { title: 'Decorative', styles: styleGroup('Decorative') },
      { title: 'Technical', styles: styleGroup('Technical') },
      { title: 'Lines through and under', styles: TEXT_DECORATORS.filter((d) => d.group === 'Lines') },
      // The three the reference tool offers that the groups above do not reach:
      // upside down and bubble live in other letter groups, and backwards is a
      // decorator rather than a letter substitution.
      { title: 'Flipped and bubble', styles: stylesNamed('upsideDown', 'circled', 'backwards') },
    ],
    [],
  )

  return (
    <ToolShell
      path="/tools/bold-text-generator"
      howTo={{
        steps: [
          'Type or paste the text you want to style.',
          'Every style updates as you type.',
          'Click Copy next to the style you want.',
          'Paste it into your bio, post, username or message.',
        ],
      }}
      faqs={[
        {
          q: 'How does bold text work on Instagram if there is no bold button?',
          a: 'These are not formatted letters. They are separate characters that simply look bold. Because the boldness is part of the character itself, and not styling added on top, it survives anywhere that accepts plain text.',
        },
        {
          q: 'Where does this work?',
          a: 'Instagram bio and captions, X posts, LinkedIn posts and headlines, Facebook, WhatsApp, Discord, Reddit, YouTube titles and descriptions, and most username boxes.',
        },
        {
          q: 'Are there downsides?',
          a: 'Two real ones. Screen readers often read these characters out strangely or skip them, so blind users may miss your text completely. Also, search does not treat them as normal letters, so bold text in your bio will not show up when someone searches for your name.',
        },
        {
          q: 'Why do some characters show as boxes?',
          a: 'A box means that device does not have a font with that character in it. Bold and italic work best. The fancier styles work least. Always check on a phone before using one in your bio.',
        },
      ]}
      about={`
        <h2>Where these characters come from</h2>
        <p>Unicode has a set of characters made for mathematics, so that a bold <strong>v</strong> and a normal <em>v</em> could mean different things in plain text. Each style — bold, italic, cursive, gothic, double struck, mono — has its own characters. Social media users then started using them as a way to get formatting on apps that do not offer any.</p>
        <h2>Use them sparingly</h2>
        <p>One bold phrase in a bio catches the eye. A whole profile in gothic letters is hard to read, impossible for screen readers, and invisible to search. This is not a small point: a screen reader that meets these letters will often read them out one by one, or skip the word completely.</p>
      `}
    >
      <Field label="Your text" htmlFor="bt-input">
        <input
          id="bt-input"
          className="field text-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to style"
        />
      </Field>

      <div className="mt-3">
        <ResetButton reset={reset} dirty={dirty} />
      </div>

      <div className="mt-6 space-y-8">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 text-sm font-bold text-ink-900">{group.title}</h2>
            <StyleGallery text={text} styles={group.styles} columns={2} />
          </section>
        ))}
      </div>
    </ToolShell>
  )
}

/* ================================================================== */
/* Bubble Text Generator                                               */
/* ================================================================== */

export function BubbleTextGenerator() {
  const [text, setText] = useState('')

  const { dirty, reset } = resetControls([[text, setText, '']])

  const bubbleStyles = useMemo(
    () => [...styleGroup('Bubble & square'), ...styleGroup('Fun'), ...styleGroup('Decorative').slice(0, 3)],
    [],
  )

  return (
    <ToolShell
      path="/tools/bubble-text-generator"
      howTo={{
        steps: [
          'Type your text in the box.',
          'Look through the bubble, square and fancy styles.',
          'Click Copy on the one you like.',
          'Paste it into a bio, caption, username or message.',
        ],
      }}
      faqs={[
        {
          q: 'What is bubble text?',
          a: 'Bubble text uses circled letters — ⓐ, ⓑ, ⓒ. These are separate characters that draw a letter inside a circle. They were first added to Unicode for Japanese and Korean printing, and for technical documents.',
        },
        {
          q: 'Will it work in my Instagram bio?',
          a: 'Yes. Circled letters have been part of Unicode since the 1990s and work on almost every device. The black filled ones are newer, and sometimes show as empty boxes on older Android phones.',
        },
        {
          q: 'Why do numbers look different from letters in some styles?',
          a: 'Because Unicode does not have every style for every character. Some styles include circled numbers, some do not. When a character has no styled version, the tool simply leaves it as it is.',
        },
        {
          q: 'Does bubble text hurt my reach?',
          a: 'It can. Search treats ⓑⓤⓑⓑⓛⓔ as completely different from "bubble", so a decorated username or bio will not appear when someone searches the normal word. Keep your name in plain letters so people can find you.',
        },
      ]}
      about={`
        <h2>Bubble, square, and the rest</h2>
        <ul>
          <li><strong>Bubble</strong> — ⓐⓑⓒ, open circles. Works on more devices than any other fancy style.</li>
          <li><strong>Black bubble</strong> — 🅐🅑🅒, filled circles. Bold and eye-catching, but works on fewer devices.</li>
          <li><strong>Square</strong> — 🄰🄱🄲, open squares. Looks technical, popular with gamers.</li>
          <li><strong>Black square</strong> — 🅰🅱🅲, filled squares. Often shows as coloured emoji on phones.</li>
          <li><strong>Upside down</strong> — turns your text over using characters that look flipped.</li>
        </ul>
        <h2>A note on accessibility</h2>
        <p>Screen readers do not handle these well. They often read each character separately, or skip them. If your account is for a business or a service, keep the important information in plain letters and use fancy characters only to highlight one or two words.</p>
      `}
    >
      <Field label="Your text" htmlFor="bb-input">
        <input
          id="bb-input"
          className="field text-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to bubble"
        />
      </Field>

      <div className="mt-3">
        <ResetButton reset={reset} dirty={dirty} />
      </div>

      <div className="mt-6">
        <StyleGallery text={text} styles={bubbleStyles} columns={2} />
      </div>
    </ToolShell>
  )
}
