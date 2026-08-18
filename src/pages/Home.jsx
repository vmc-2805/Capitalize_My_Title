import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { breadcrumbSchema, faqSchema, organizationSchema, softwareSchema, websiteSchema } from '../components/Seo.jsx'
import {
  CopyButton,
  DownloadButton,
  FaqSection,
  Icon,
  RelatedTools,
  StatGrid,
  Tabs,
  Toggle,
  useLocalStorage,
} from '../components/ui.jsx'
import { HOME_PAGE, TOOL_GROUPS, relatedTools } from '../data/navigation.js'
import { STYLE_GUIDES } from '../lib/capitalize.js'
import { CASE_ACTIONS, applyCaseAction, scoreHeadline, textStats, toCurlyQuotes, toStraightQuotes } from '../lib/textCase.js'

const SAMPLE = 'the quick brown fox jumps over the lazy dog: a study of speed and rest'

const FAQS = [
  {
    q: 'What is title case?',
    a: 'In title case, the first word, the last word and all the important words of a title start with a capital letter. Small words like "a", "the", "and" and short prepositions stay in small letters. Which words count as small depends on the style guide you follow.',
  },
  {
    q: 'Which style guide should I use?',
    a: 'Use APA for psychology, education and social sciences. Use Chicago for books. Use AP for news, PR and marketing. Use MLA for literature and school or college essays. Use AMA for medical writing and Bluebook for legal work. If nobody has told you which one to use, and it is not academic work, choose AP. It is the safest.',
  },
  {
    q: 'Why do APA and Chicago give different answers?',
    a: 'APA capitalizes any word of four letters or more, so you get "Between". Chicago keeps every preposition small, however long it is, so you get "between". APA counts letters. Chicago looks at the type of word. That one difference explains most of the results you see.',
  },
  {
    q: 'Do you capitalize the word after a colon?',
    a: 'Yes. Every major style guide capitalizes the first word after a colon, even a small word. "Editing: A Field Guide" is correct. "Editing: a Field Guide" is not. This is the mistake people make most often.',
  },
  {
    q: 'Is my text sent to your server?',
    a: 'No. All the work happens in your browser. Nothing you paste is sent, saved or stored anywhere. Once the page has loaded, the tool even keeps working without internet.',
  },
  {
    q: 'Is there any word or character limit?',
    a: 'No. Paste one headline or a full document. Each line is handled separately, so you can fix fifty headings together in one go.',
  },
  {
    q: 'Does it handle short forms and brand names?',
    a: 'Yes. Words already in capitals, like NASA and HTML, stay that way. Brand names with capitals inside them, like iPhone, eBay and YouTube, also stay correct. You can add your own words in the custom dictionary below the tool.',
  },
  {
    q: 'What is the difference between title case and sentence case?',
    a: 'Title case capitalizes all the important words: "How to Write a Good Report". Sentence case capitalizes only the first word and names: "How to write a good report". Use title case for titles of published work, and sentence case for headings inside a page, buttons and email subject lines.',
  },
]

function StyleRules({ guide }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold text-ink-900">{guide.name}</h2>
        <span className="text-xs text-ink-500">{guide.usedFor}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-ink-700">{guide.summary}</p>
      <ul className="mt-3 space-y-1.5">
        {guide.rules.map((rule) => (
          <li key={rule} className="flex gap-2 text-sm leading-6 text-ink-700">
            <Icon.check className="mt-1.5 shrink-0 text-brand-600" width={14} height={14} />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function HeadlineScore({ text }) {
  const analysis = useMemo(() => scoreHeadline(text), [text])
  if (!text.trim()) return null

  const colour =
    analysis.score >= 85 ? 'text-emerald-600' : analysis.score >= 70 ? 'text-brand-600' : analysis.score >= 50 ? 'text-amber-600' : 'text-red-600'
  const bar =
    analysis.score >= 85 ? 'bg-emerald-500' : analysis.score >= 70 ? 'bg-brand-500' : analysis.score >= 50 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <section className="card p-5" aria-labelledby="score-heading">
      <div className="flex items-center justify-between gap-4">
        <h2 id="score-heading" className="text-sm font-bold text-ink-900">
          Headline score
        </h2>
        <span className={`text-2xl font-bold tabular-nums ${colour}`}>
          {analysis.score}
          <span className="text-sm font-medium text-ink-500">/100 · {analysis.grade}</span>
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full transition-all ${bar}`} style={{ width: `${analysis.score}%` }} />
      </div>

      <ul className="mt-4 space-y-2">
        {analysis.checks.map((check) => (
          <li key={check.label} className="flex items-start gap-2 text-sm">
            <span className={`mt-0.5 shrink-0 ${check.ok ? 'text-emerald-600' : 'text-gray-300'}`}>
              <Icon.check width={15} height={15} />
            </span>
            <span>
              <span className={check.ok ? 'font-medium text-ink-900' : 'font-medium text-ink-700'}>{check.label}</span>
              {!check.ok && <span className="block text-xs leading-5 text-ink-500">{check.tip}</span>}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
        <p className="text-xs font-bold tracking-wide text-ink-500 uppercase">How it will look</p>
        <p className="text-sm text-ink-700">
          <span className="font-semibold">On Google:</span>{' '}
          <span className={analysis.truncatedInGoogle ? 'text-red-600' : 'text-emerald-700'}>
            {analysis.truncatedInGoogle ? `Will be cut at about 60 characters (${analysis.characters})` : 'Shows fully'}
          </span>
        </p>
        <p className="text-sm text-ink-700">
          <span className="font-semibold">As an email subject:</span>{' '}
          <span className={analysis.truncatedInEmail ? 'text-amber-600' : 'text-emerald-700'}>
            {analysis.truncatedInEmail ? 'Will probably be cut on phones (over 50)' : 'Fits on phones'}
          </span>
        </p>
      </div>
    </section>
  )
}

function CustomDictionary({ dictionary, setDictionary }) {
  const update = (key) => (e) => setDictionary({ ...dictionary, [key]: e.target.value })
  return (
    <section className="card p-5" aria-labelledby="dict-heading">
      <h2 id="dict-heading" className="text-sm font-bold text-ink-900">
        Custom dictionary
      </h2>
      <p className="mt-1 text-xs leading-5 text-ink-500">
        Words that must always look a certain way, whatever the style guide says. Separate them with commas. They are
        saved in this browser only.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="label">Always UPPERCASE</span>
          <input
            className="field"
            value={dictionary.alwaysUppercase}
            onChange={update('alwaysUppercase')}
            placeholder="nasa, iso, faq"
          />
        </label>
        <label className="block">
          <span className="label">Always Capitalized</span>
          <input
            className="field"
            value={dictionary.alwaysCapitalize}
            onChange={update('alwaysCapitalize')}
            placeholder="acme, zendesk"
          />
        </label>
        <label className="block">
          <span className="label">Always lowercase</span>
          <input
            className="field"
            value={dictionary.alwaysLowercase}
            onChange={update('alwaysLowercase')}
            placeholder="von, de, ibid"
          />
        </label>
      </div>
    </section>
  )
}

export default function Home() {
  const [input, setInput] = useState('')
  const [styleKey, setStyleKey] = useState('apa')
  const [action, setAction] = useState('title')
  const [quotes, setQuotes] = useState('as-typed')
  const [preserveAcronyms, setPreserveAcronyms] = useLocalStorage('cmt:preserveAcronyms', true)
  const [preserveMixedCase, setPreserveMixedCase] = useLocalStorage('cmt:preserveMixedCase', true)
  const [dictionary, setDictionary] = useLocalStorage('cmt:dictionary', {
    alwaysUppercase: '',
    alwaysCapitalize: '',
    alwaysLowercase: '',
  })

  const guide = STYLE_GUIDES.find((g) => g.key === styleKey) || STYLE_GUIDES[0]

  const options = useMemo(
    () => ({
      preserveAcronyms,
      preserveMixedCase,
      alwaysUppercase: dictionary.alwaysUppercase.split(',').map((w) => w.trim()).filter(Boolean),
      alwaysCapitalize: dictionary.alwaysCapitalize.split(',').map((w) => w.trim()).filter(Boolean),
      alwaysLowercase: dictionary.alwaysLowercase.split(',').map((w) => w.trim()).filter(Boolean),
    }),
    [preserveAcronyms, preserveMixedCase, dictionary],
  )

  const output = useMemo(() => {
    if (!input) return ''
    let result = applyCaseAction(input, action, styleKey, options)
    if (quotes === 'curly') result = toCurlyQuotes(result)
    if (quotes === 'straight') result = toStraightQuotes(result)
    return result
  }, [input, action, styleKey, options, quotes])

  const stats = useMemo(() => textStats(output || input), [output, input])

  const styleTabs = STYLE_GUIDES.map((g) => ({ key: g.key, label: g.label, title: g.name }))

  const trail = [{ label: 'Home', href: '/' }]

  return (
    <>
      <Seo
        title={HOME_PAGE.title}
        description={HOME_PAGE.description}
        keywords={HOME_PAGE.keywords}
        path="/"
        jsonLd={[
          websiteSchema(),
          organizationSchema(),
          softwareSchema(HOME_PAGE),
          faqSchema(FAQS),
          breadcrumbSchema(trail),
        ]}
      />

      <section className="border-b border-gray-200 bg-white">
        <div className="container-page py-8">
          <h1 className="text-[30px] leading-tight font-bold tracking-tight text-ink-900 sm:text-[38px]">
            Capitalize My Title
          </h1>
          <p className="mt-2.5 max-w-3xl text-base leading-7 text-ink-700">{HOME_PAGE.intro}</p>
          <p className="mt-3 text-xs tracking-wide text-ink-500">
            Free · No signup · Whatever you type stays in your browser
          </p>
        </div>
      </section>

      <div className="container-page py-8">
        <ol className="mb-6 grid gap-x-8 gap-y-3 rounded-md border border-gray-200 bg-white p-4 sm:grid-cols-3">
          {[
            'Pick the style guide your college, publisher or office follows — the tabs are right below.',
            'Type or paste your title. Paste many lines at once if you have a whole list.',
            'Press Copy result. Or use the grey buttons for sentence case, UPPERCASE and the rest.',
          ].map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm leading-6 text-ink-700">{step}</span>
            </li>
          ))}
        </ol>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <div className="min-w-0">
            <div className="card overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 pt-3">
                <p className="mb-1.5 text-xs font-bold tracking-[0.08em] text-ink-500 uppercase">
                  Step 1 — choose a style guide
                </p>
                <Tabs tabs={styleTabs} active={styleKey} onChange={setStyleKey} />
              </div>

              <div className="p-4 sm:p-5">
                <label htmlFor="title-input" className="label">
                  Step 2 — type your title, or paste your text
                </label>
                <textarea
                  id="title-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={4}
                  spellCheck
                  placeholder="Type or paste your title here. One per line if you have many."
                  className="field resize-y font-medium sm:text-base"
                />

                <p className="mt-4 mb-1.5 text-xs font-bold tracking-[0.08em] text-ink-500 uppercase">
                  Step 3 — choose what to do
                </p>
                <div className="flex flex-wrap gap-2">
                  {CASE_ACTIONS.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      title={item.hint}
                      onClick={() => setAction(item.key)}
                      className={
                        item.key === action
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-gray-100 pt-4">
                  <Toggle
                    checked={preserveAcronyms}
                    onChange={setPreserveAcronyms}
                    label="Keep short forms like NASA in capitals"
                  />
                  <Toggle
                    checked={preserveMixedCase}
                    onChange={setPreserveMixedCase}
                    label="Keep brand names like iPhone"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink-700">Quotes:</span>
                    {[
                      { key: 'as-typed', label: 'As typed' },
                      { key: 'straight', label: 'Straight " \'' },
                      { key: 'curly', label: 'Curly “ ‘' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setQuotes(opt.key)}
                        className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                          quotes === opt.key ? 'bg-brand-600 text-white' : 'bg-gray-100 text-ink-700 hover:bg-gray-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="label mb-0">Step 4 — copy your result</span>
                    <span className="text-xs text-ink-500">{guide.name}</span>
                  </div>
                  <output
                    className={`block min-h-[92px] w-full rounded-md border border-gray-200 bg-brand-50/40 p-3.5 text-base leading-7 font-medium whitespace-pre-wrap ${
                      output ? 'text-ink-900' : 'text-gray-400'
                    }`}
                  >
                    {output || 'Your corrected title will appear here.'}
                  </output>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <CopyButton value={output} label="Copy result" className="btn-primary" />
                    <DownloadButton value={output} filename="titles.txt" />
                    <button type="button" className="btn-secondary" onClick={() => setInput(SAMPLE)}>
                      Try an example
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => setInput('')} disabled={!input}>
                      <Icon.trash />
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <StatGrid
                stats={[
                  { label: 'Words', value: stats.words },
                  { label: 'Characters', value: stats.characters },
                  { label: 'Sentences', value: stats.sentences },
                  { label: 'Reading time', value: `${Math.max(1, Math.round(stats.readingTimeSeconds / 60))} min` },
                ]}
              />
            </div>

            <div className="mt-6">
              <StyleRules guide={guide} />
            </div>

            <div className="mt-6">
              <CustomDictionary dictionary={dictionary} setDictionary={setDictionary} />
            </div>

            <section className="prose-basic mt-12 max-w-3xl">
              <h2>How to capitalize a title correctly</h2>
              <p>
                Every title case rule comes down to one question: which words are important enough to get a capital
                letter? All eight title case guides on this page agree on the main part. The first word, the last word
                and every important word — nouns, pronouns, verbs, adjectives and adverbs — get a capital. They only
                disagree about the small words in between.
              </p>
              <p>
                <strong>APA, AP and AMA count letters.</strong> Any word of four letters or more gets a capital,
                whatever type of word it is. So you get <em>Between</em>, <em>Through</em> and <em>With</em>.
              </p>
              <p>
                <strong>Chicago and MLA look at the type of word.</strong> Every preposition stays small, however long
                it is. So the same title gives you <em>between</em>, <em>through</em> and <em>with</em>.
              </p>
              <p>
                <strong>Bluebook and Wikipedia are in the middle.</strong> They keep words of four letters or fewer
                small. The <strong>New York Times</strong> does not use a rule at all — it uses a fixed list of small
                words.
              </p>

              <h2>The rules everyone agrees on</h2>
              <ul>
                <li>Always capitalize the first word, even if it is "a" or "the".</li>
                <li>Always capitalize the first word after a colon. This is where most mistakes happen.</li>
                <li>Capitalize all nouns, verbs, adjectives and adverbs, however short. "Is" and "Be" are verbs.</li>
                <li>Never use capitals just to make a word look important. Use italics instead.</li>
                <li>Leave short forms as they are. NASA, HTML and PDF do not become Nasa, Html and Pdf.</li>
              </ul>

              <h2>The other buttons, and when to use them</h2>
              <p>
                <strong>Sentence case</strong> capitalizes only the first word and names. Use it for headings inside a
                page, buttons, form labels and email subject lines.
              </p>
              <p>
                <strong>Proper case</strong> capitalizes the first letter of every word and makes the rest small. This
                is what you want for names and addresses exported from a database.
              </p>
              <p>
                <strong>First letter</strong> does the same but does not touch the other letters, so <em>iPhone</em>{' '}
                stays <em>iPhone</em>. And <strong>alternating</strong> and <strong>toggle</strong> case are mostly for
                jokes and memes, which is a perfectly good use of a free tool.
              </p>

              <h2>Fixing a full document</h2>
              <p>
                Paste as many lines as you want. Each line is handled on its own, so a list of forty headings comes
                back matching in one go. This is the fastest way to do the consistency check we explain in our{' '}
                <Link to="/blog/self-editing-checklist">self-editing checklist</Link>. It catches the mix of title case
                and sentence case that slowly creeps into any document written over a few weeks.
              </p>

              <h2>Which guide do Indian schools and colleges use?</h2>
              <p>
                Most Indian universities follow APA or MLA, and many management and commerce courses use APA. Science
                and medical journals usually ask for AMA or their own house style. Always check your department
                handbook first, because the guide named there is the one your marks depend on. If your workplace has
                no rule at all, use AP — it is the easiest to read and the hardest to get wrong.
              </p>
            </section>

            <FaqSection faqs={FAQS} />
            <RelatedTools tools={relatedTools('/')} title="Popular tools" />
          </div>

          <aside className="mt-8 lg:mt-0">
            <HeadlineScore text={input} />
          </aside>
        </div>

        <section className="mt-16" aria-labelledby="all-tools-heading">
          <h2 id="all-tools-heading" className="mb-1 text-2xl font-bold text-ink-900">
            Everything else we make
          </h2>
          <p className="mb-6 text-sm text-ink-500">
            Free tools for writers, students, marketers and anyone who works with text every day.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOOL_GROUPS.map((group) => (
              <div key={group.id}>
                <h3 className="mb-2 text-xs font-bold tracking-wide text-brand-600 uppercase">{group.label}</h3>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} className="text-sm text-ink-700 transition hover:text-brand-600">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
