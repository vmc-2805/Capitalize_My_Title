import { useEffect, useMemo, useState } from 'react'
import ToolShell from '../components/ToolShell.jsx'
import {
  Callout,
  CopyButton,
  Field,
  Icon,
  LoadingState,
  NumberInput,
  Select,
  useCopy,
} from '../components/ui.jsx'
import { STYLE_GUIDES } from '../lib/capitalize.js'
import { generateTitles, rewriteTitle, REWRITE_ANGLES } from '../lib/generators.js'
import {
  BOOK_GENRES,
  ESSAY_GRADES,
  ESSAY_TYPES,
  POEM_TYPES,
  TONES,
  USES,
} from '../lib/titleOptions.js'
import { newSeed } from '../lib/random.js'
import { requestTitles } from '../lib/aiService.js'
import { scoreHeadline } from '../lib/textCase.js'

const STYLE_OPTIONS = STYLE_GUIDES.filter((g) => g.mode !== 'sentence').map((g) => ({
  value: g.key,
  label: g.name,
}))

function lengthTone(length, limit) {
  if (length <= limit) return 'text-emerald-600'
  if (length <= limit + 10) return 'text-amber-600'
  return 'text-red-600'
}

/** One labelled row inside the Options panel. */
function OptionRow({ label, htmlFor, children }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
      <label htmlFor={htmlFor} className="w-28 shrink-0 text-sm font-bold text-ink-900">
        {label}
      </label>
      <div className="w-full max-w-[240px]">{children}</div>
    </div>
  )
}

/**
 * Shared UI for the five title generators: one input with a Get Titles button,
 * a collapsible Options panel, and results only after the button is pressed.
 */
function TitleGeneratorPage({
  path,
  kind,
  topicPlaceholder,
  useLabel,
  useOptions,
  defaultUse,
  limit = 60,
  defaultStyle = 'ap',
  // The headline score rewards numbers, power words and a 40–60 character
  // length. That is right for a blog or video title and wrong for a book,
  // poem or essay title, so those pages hide it rather than show a bad grade.
  showScore = true,
  extraOptions,
  optionValues = {},
  // Each page owns its own extra dropdowns, so it also has to tell us whether
  // they have been changed and how to put them back.
  extrasDirty = false,
  onResetExtras,
  howTo,
  faqs,
  about,
}) {
  const [topic, setTopic] = useState('')
  const [optionsOpen, setOptionsOpen] = useState(true)
  const [tone, setTone] = useState('standard')
  const [use, setUse] = useState(defaultUse ?? kind)
  // `request` is only replaced when Get Titles is pressed, so changing a
  // dropdown never rewrites the list under the reader's eyes.
  const [request, setRequest] = useState(null)
  // `busy` is derived from which request has been answered, not kept in its own
  // flag. A flag is only set once the effect runs, a render later, and in that
  // gap the page shows the empty state instead of the loader. It also cannot
  // get stuck on if Reset lands while a request is still in the air.
  const [answer, setAnswer] = useState({ request: null, titles: [] })
  const busy = Boolean(request) && answer.request !== request
  const titles = answer.request === request ? answer.titles : []
  const { copied, copy } = useCopy()

  useEffect(() => {
    if (!request) return undefined

    // A slow reply for an older request must not overwrite a newer one.
    let current = true
    const { topic: t, ...rest } = request
    requestTitles(rest.kind, t, rest).then((result) => {
      if (current) setAnswer({ request, titles: result.titles })
    })

    return () => {
      current = false
    }
  }, [request])

  const submit = (event) => {
    event.preventDefault()
    setRequest({
      kind: use || kind,
      topic,
      count: 12,
      seed: newSeed(),
      style: defaultStyle,
      tone,
      ...optionValues,
    })
  }

  const canReset =
    Boolean(topic || request) || tone !== 'standard' || use !== (defaultUse ?? kind) || extrasDirty

  const reset = () => {
    setTopic('')
    setTone('standard')
    setUse(defaultUse ?? kind)
    // Clearing the request is enough: the titles are derived from it, so a
    // reply still in flight for the old request is ignored on arrival.
    setRequest(null)
    onResetExtras?.()
    document.getElementById('tg-topic')?.focus()
  }

  return (
    <ToolShell path={path} howTo={howTo} faqs={faqs} about={about}>
      <form onSubmit={submit}>
        <div className="flex flex-wrap gap-2">
          <div className="flex min-w-0 flex-1">
            <input
              id="tg-topic"
              className="min-w-0 flex-1 rounded-l-md border border-r-0 border-gray-300 bg-white px-4 py-3 text-lg text-ink-900 outline-none transition placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={topicPlaceholder}
              aria-label={topicPlaceholder}
            />
            <button type="submit" className="btn-primary shrink-0 rounded-l-none px-5 py-3" disabled={busy}>
              {busy && <Icon.spinner />}
              {busy ? 'Working…' : 'Get Titles'}
            </button>
          </div>
          <button
            type="button"
            className="btn-secondary shrink-0 px-4 py-3"
            onClick={reset}
            disabled={!canReset}
            title="Clear the box, the results and every option"
          >
            <Icon.trash />
            Reset
          </button>
        </div>
      </form>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => setOptionsOpen((o) => !o)}
          aria-expanded={optionsOpen}
          className="flex w-full cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 text-sm font-semibold text-ink-700"
        >
          Options
          <Icon.chevronDown className={`transition ${optionsOpen ? 'rotate-180' : ''}`} />
        </button>

        {optionsOpen && (
          <div className="space-y-4 border-t border-gray-200 p-4">
            <OptionRow label="Tone:" htmlFor="tg-tone">
              <Select id="tg-tone" value={tone} onChange={setTone} options={TONES} />
            </OptionRow>

            <OptionRow label={useLabel || 'Use:'} htmlFor="tg-use">
              <Select id="tg-use" value={use} onChange={setUse} options={useOptions || USES} />
            </OptionRow>

            {extraOptions}
          </div>
        )}
      </div>

      <div className="mt-6">
        {busy ? (
          <LoadingState rows={5}>Writing your titles…</LoadingState>
        ) : titles.length === 0 ? (
          <p className="py-4 text-center text-[15px] font-bold text-ink-700">
            Click the "Get Titles" button above to see titles.
          </p>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-ink-900">{titles.length} title ideas</h2>
              <button
                type="button"
                className="btn-secondary !py-1.5 !text-xs"
                onClick={() => copy(titles.join('\n'))}
              >
                {copied ? <Icon.check /> : <Icon.copy />}
                {copied ? 'Copied all' : 'Copy all'}
              </button>
            </div>

            <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              {titles.map((title) => (
                <li key={title} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="min-w-0 flex-1 text-[15px] font-medium text-ink-900">{title}</span>
                  <span className={`shrink-0 text-xs font-semibold tabular-nums ${lengthTone(title.length, limit)}`}>
                    {title.length} chars
                  </span>
                  {showScore && <span className="chip shrink-0">{scoreHeadline(title).score}/100</span>}
                  <CopyButton value={title} label="" className="btn-ghost !px-2 !py-1" />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-500">
              Press Get Titles again for a fresh set. The character counts are colour-coded against the{' '}
              {limit}-character limit for this format.
            </p>
          </>
        )}
      </div>
    </ToolShell>
  )
}

/* ================================================================== */

export function AiTitleGenerator() {
  return (
    <TitleGeneratorPage
      path="/tools/ai-title-generator"
      kind="blog"
      topicPlaceholder="Enter a topic"
      defaultUse="blog"
      limit={60}
      howTo={{
        steps: [
          'Type your topic in simple words — "remote team onboarding", not "onboarding strategies".',
          'Open <strong>Options</strong> to set the tone, and to choose what you are writing: a blog post, an essay, a video and so on.',
          'Press <strong>Get Titles</strong>. Press it again any time for a completely fresh set.',
          'Copy the one you like, then edit it into your own words.',
        ],
      }}
      faqs={[
        {
          q: 'How does this generator work?',
          a: 'It joins your topic to title patterns that are known to work: numbered lists, how-to titles, clear promises, honest curiosity and plain descriptions. Then it applies the capitalization rules of the style guide you choose. Everything runs in your browser, so there is no API key, no daily limit and no cost.',
        },
        {
          q: 'How long should my title be?',
          a: 'Between 50 and 60 characters. Google cuts titles at about 600 pixels of width, which is roughly 60 characters for normal English. Every result here shows its character count against that limit.',
        },
        {
          q: 'Should I use the title exactly as it is?',
          a: 'Treat it as a first draft. The pattern is the useful part. The exact words should be yours. Usually the fifth or sixth idea is the best one, because by then you have moved past your usual way of saying things.',
        },
        {
          q: 'How many titles should I write before choosing one?',
          a: 'At least ten. The first three ideas anyone has are always the obvious ones. Generate twenty, pick three, then put those three through the title rewriter to see each one from a different angle.',
        },
        {
          q: 'Will these titles rank on Google?',
          a: 'A title alone cannot rank a page. But a clear title with your keyword near the start does help, and it decides whether people click when they do see you. Put the keyword in the first half of the title.',
        },
      ]}
      about={`
        <h2>What makes a title work</h2>
        <p>Every good title does one of three things. It names a clear result, it names a clear problem, or it promises a clear number of things. Being vague is the one mistake that always fails. "How to Improve Your Writing" fails. "The Five-Minute Check Every Draft Needs" works, because only one article could be behind it.</p>
        <h2>Patterns used here</h2>
        <ul>
          <li><strong>Number + thing + benefit</strong> — tells the reader exactly how much they are getting.</li>
          <li><strong>How to do X without Y</strong> — names the goal and the problem in one line.</li>
          <li><strong>The question your reader is typing</strong> — the strongest pattern for search traffic.</li>
          <li><strong>Saying the opposite of what everyone says</strong> — works very well, but only when it is true.</li>
          <li><strong>Plain description</strong> — the right choice for reference pages that do not need a hook.</li>
        </ul>
        <h2>What to do next</h2>
        <p>Once you have three favourites, check each one in the <a href="/">headline score</a> for length and word mix. Then use the <a href="/tools/ai-title-rewriter">title rewriter</a> to make different versions you can test against each other.</p>
      `}
    />
  )
}

export function PoemTitleGenerator() {
  const [poemType, setPoemType] = useState('any')

  return (
    <TitleGeneratorPage
      path="/tools/poem-title-generator"
      kind="poem"
      topicPlaceholder="Describe your poem"
      defaultUse="poem"
      limit={45}
      defaultStyle="chicago"
      showScore={false}
      optionValues={{ poemType }}
      extrasDirty={poemType !== 'any'}
      onResetExtras={() => setPoemType('any')}
      extraOptions={
        <OptionRow label="Poem Type:" htmlFor="tg-poem-type">
          <Select id="tg-poem-type" value={poemType} onChange={setPoemType} options={POEM_TYPES} />
        </OptionRow>
      }
      howTo={{
        steps: [
          'Describe your poem, or leave the box empty for open ideas.',
          'In <strong>Options</strong>, pick a Poem Type. Ode, elegy, sonnet and ballad each give a different kind of title.',
          'Press <strong>Get Titles</strong>, then read the results aloud. A poem title has to sound right, not just look right.',
          'Keep the ones that raise a question in your mind. Those are worth writing towards.',
        ],
      }}
      faqs={[
        {
          q: 'Should I title a poem before or after writing it?',
          a: 'Usually after. But a title made first can also work as a starting idea. Most editors agree on one rule: the title should add something the poem does not already say. It should not just repeat the first line.',
        },
        {
          q: 'What makes a good poem title?',
          a: 'Something solid, plus a small angle. "Ode to a Weathered Lantern" gives the reader an object and a feeling. "Feelings" gives nothing. Titles that name a form, like ode, elegy or self-portrait, set an expectation that the poem can then meet or break.',
        },
        {
          q: 'Can I use these titles for a whole collection?',
          a: 'Yes. Collections are often named after one poem inside them, so a strong single title often works as a book title too. Just check that it still reads well on its own, without the poem below it.',
        },
        {
          q: 'Do poem titles use title case?',
          a: 'Chicago style title case is the most common choice in poetry publishing. Many modern poets use all small letters on purpose, as part of the voice of the poem. Both are accepted. Being consistent across your whole manuscript matters more than which one you pick.',
        },
      ]}
      about={`
        <h2>Common title forms in modern poetry</h2>
        <ul>
          <li><strong>The named form</strong> — "Ode to…", "Elegy for…". Sets a tone in three words.</li>
          <li><strong>The plain image</strong> — "Winter Orchard". Trusts the reader to make the connection.</li>
          <li><strong>The self-portrait</strong> — "Self-Portrait as a Stairwell". Used everywhere right now, and still works.</li>
          <li><strong>The counted list</strong> — "Seven Ways of Looking at a Harbour". Old idea, still useful.</li>
          <li><strong>Speaking to someone</strong> — "Letter to My Younger Self". Gives you a speaker and a listener at once.</li>
        </ul>
      `}
    />
  )
}

export function BookTitleGenerator() {
  const [genre, setGenre] = useState('any')

  return (
    <TitleGeneratorPage
      path="/tools/book-title-generator"
      kind="book"
      topicPlaceholder="Describe your book"
      defaultUse="book"
      limit={50}
      defaultStyle="chicago"
      showScore={false}
      optionValues={{ genre }}
      extrasDirty={genre !== 'any'}
      onResetExtras={() => setGenre('any')}
      extraOptions={
        <OptionRow label="Genre:" htmlFor="tg-genre">
          <Select id="tg-genre" value={genre} onChange={setGenre} options={BOOK_GENRES} />
        </OptionRow>
      }
      howTo={{
        steps: [
          'Describe your book, or leave the box empty for open ideas.',
          'In <strong>Options</strong>, choose your Genre. A thriller and a romance get completely different words.',
          'Press <strong>Get Titles</strong>, then say each one aloud as if telling a friend about the book.',
          'Pick three, search them on Amazon to check they are free, and look at them at cover size.',
        ],
      }}
      faqs={[
        {
          q: 'Can two books have the same title?',
          a: 'Yes. In most countries a title cannot be copyrighted, so the same title on two books is legal and quite common. It is still a bad idea. You will fight the other book for search results, and some readers will buy the wrong one.',
        },
        {
          q: 'How long should a book title be?',
          a: 'For fiction, two to five words is best, because it has to be readable as a small thumbnail on an online store. Non-fiction can be longer, since the subtitle carries the details: a short hook, a colon, then a clear promise.',
        },
        {
          q: 'Should the title use title case?',
          a: 'Yes, on the copyright page, in the book details and in any reference. The cover itself is a design choice — all capitals, all small letters and mixed case are all common. But the official title should be correctly capitalized wherever it appears as normal text.',
        },
        {
          q: 'What makes a title easy to remember?',
          a: 'Simple, solid words placed in a way you have not seen before. "The Remains of the Day", "Station Eleven", "The White Tiger" — none of them use difficult words. They just put ordinary words together in an unusual way. Vague words are the enemy, and so is over-explaining.',
        },
      ]}
      about={`
        <h2>Fiction and non-fiction need different titles</h2>
        <p><strong>Fiction</strong> sells on interest. The title only has to make a reader pick the book up, and it does that with sound and surprise, not information. Two to five words, solid, slightly unusual.</p>
        <p><strong>Non-fiction</strong> sells on a promise. The main title can be a hook, but the subtitle must say exactly who the book is for and what they get. "Atomic Habits: An Easy and Proven Way to Build Good Habits and Break Bad Ones" is the pattern to copy.</p>
        <h2>Check these before you decide</h2>
        <ul>
          <li>Search the exact title on Amazon and Goodreads. If a well-selling book already has it, choose another.</li>
          <li>Check the domain name and social media handles, if the book will have its own page.</li>
          <li>Say it in a sentence: "Have you read <em>___</em>?" If it feels awkward to say, nobody will recommend it.</li>
          <li>Look at it as a thumbnail. If you cannot read it at 100 pixels wide, it is too long.</li>
        </ul>
      `}
    />
  )
}

export function YouTubeTitleGenerator() {
  return (
    <TitleGeneratorPage
      path="/tools/youtube-title-generator"
      kind="youtube"
      topicPlaceholder="Enter a topic"
      defaultUse="youtube"
      limit={60}
      howTo={{
        steps: [
          'Type your video topic in simple words.',
          'In <strong>Options</strong>, set the tone and add your main search keyword.',
          'Press <strong>Get Titles</strong>. Keep one under 60 characters, because YouTube cuts the rest on phones.',
          'Choose a thumbnail that adds something new, instead of repeating the same words.',
        ],
      }}
      faqs={[
        {
          q: 'How long should a YouTube title be?',
          a: 'Under 60 characters. YouTube allows 100, but search results, the home feed on phones and the suggested video list all cut it much earlier. Put anything important in the first 40 characters.',
        },
        {
          q: 'Does the title affect YouTube search ranking?',
          a: 'Yes. The title is one of the strongest signals YouTube uses, along with the description and how people watch. Put your main keyword near the start, and write it the way a viewer would actually search for it.',
        },
        {
          q: 'Should the title and thumbnail say the same thing?',
          a: 'No. They should work together. If the thumbnail already shows the finished result, the title should add something else: what it cost, how long it took, or what went wrong. Repeating the same thing wastes half your space.',
        },
        {
          q: 'Do titles in ALL CAPS get more clicks?',
          a: 'One or two capitalized words for emphasis can help. A full title in capitals looks desperate, and YouTube itself tells creators not to do it.',
        },
        {
          q: 'Should I put my channel name in the title?',
          a: 'No. It wastes characters that your keyword needs, and viewers can already see your channel name below the title.',
        },
      ]}
      about={`
        <h2>What makes people click on YouTube</h2>
        <p>People judge the title and thumbnail together, in about one second. These patterns work again and again:</p>
        <ul>
          <li><strong>A number or a time period</strong> — "I Tried X for 30 Days", "50 Hours of…". Clear numbers set clear expectations.</li>
          <li><strong>Promising the result</strong> — "Here's What Happened". It promises an answer without giving it away.</li>
          <li><strong>Comparison</strong> — "X vs Y", "Before vs After". Easy to understand instantly.</li>
          <li><strong>A warning</strong> — "Do NOT Buy X Until You Watch This". Very effective, but it destroys trust fast if the video does not deliver.</li>
          <li><strong>Plain tutorial</strong> — "How to X — Full Guide". Fewer clicks on the home feed, many more from search.</li>
        </ul>
        <h2>Search videos and browse videos need different titles</h2>
        <p>A video made for search should be plain and put the keyword first, because the viewer already knows what they want. A video made for the home feed needs a hook, because the viewer was not looking for it. Decide which one you are making before you choose a title.</p>
      `}
    />
  )
}

export function EssayTitleGenerator() {
  const [essayType, setEssayType] = useState('any')
  const [essayGrade, setEssayGrade] = useState('high')

  return (
    <TitleGeneratorPage
      path="/tools/essay-title-generator"
      kind="essay"
      topicPlaceholder="Describe your essay"
      defaultUse="essay"
      limit={90}
      defaultStyle="apa"
      showScore={false}
      optionValues={{ essayType, essayGrade }}
      extrasDirty={essayType !== 'any' || essayGrade !== 'high'}
      onResetExtras={() => {
        setEssayType('any')
        setEssayGrade('high')
      }}
      extraOptions={
        <>
          <OptionRow label="Essay Type:" htmlFor="tg-essay-type">
            <Select id="tg-essay-type" value={essayType} onChange={setEssayType} options={ESSAY_TYPES} />
          </OptionRow>
          <OptionRow label="Essay Grade:" htmlFor="tg-essay-grade">
            <Select id="tg-essay-grade" value={essayGrade} onChange={setEssayGrade} options={ESSAY_GRADES} />
          </OptionRow>
        </>
      }
      howTo={{
        steps: [
          'Describe your essay subject as a phrase, not as a question.',
          'In <strong>Options</strong>, set the Essay Type and the Essay Grade. A school essay and a graduate paper need very different titles.',
          'Set the capitalization style your college asks for. APA, MLA and Chicago each capitalize differently.',
          'Press <strong>Get Titles</strong> and pick one that names both your subject and your view on it.',
        ],
      }}
      faqs={[
        {
          q: 'How long should an essay title be?',
          a: 'APA says no more than 12 words. MLA and Chicago do not give a fixed limit, but the normal shape is a short main title, a colon, then a specific subtitle. After about 15 words it starts reading like a summary instead of a title.',
        },
        {
          q: 'Should my essay title be a question?',
          a: 'Usually not. A question suggests you have not decided your argument yet. Name the subject and your position instead: "Rethinking Screen Time: Attention as a Shared Resource, Not a Personal One".',
        },
        {
          q: 'Which style guide should I use?',
          a: 'The one your department asks for. APA capitalizes words of four letters or more. Chicago and MLA keep all prepositions small, however long they are. This tool applies whichever you choose, so you can submit the result directly.',
        },
        {
          q: 'Can I use a colon and a subtitle?',
          a: 'Yes. It is the normal style in academic writing, because it does two jobs at once. The main title carries the idea. The subtitle carries the method, the time period or the group you studied.',
        },
        {
          q: 'Do Indian universities follow APA or MLA?',
          a: 'Both are common. Arts and literature courses usually ask for MLA. Social science, education and management courses usually ask for APA. Check your department handbook, because that is the guide your marks depend on.',
        },
      ]}
      about={`
        <h2>The shape most academic titles follow</h2>
        <p>Almost every strong academic title follows the same shape: <strong>idea, colon, details</strong>. The main title says what the idea or problem is. The subtitle says what exactly you studied and how. "The Ethics of Screen Time: A Two-Year Study of Attention in Three City Schools" tells a reader everything they need in order to decide whether to read further.</p>
        <h2>What to avoid</h2>
        <ul>
          <li><strong>Being clever without being clear.</strong> A wordplay title that does not name the subject makes your paper hard to find and hard to cite.</li>
          <li><strong>Question titles.</strong> They sound unfinished, unless the paper is genuinely a review of a debate.</li>
          <li><strong>"An Analysis of…"</strong> — every essay is an analysis. Remove the phrase and start with the subject itself.</li>
          <li><strong>Heavy technical words in the main title.</strong> Keep those for the subtitle, where they do real work.</li>
        </ul>
      `}
    />
  )
}

/* ================================================================== */
/* AI Title Rewriter                                                   */
/* ================================================================== */

export function AiTitleRewriter() {
  const [title, setTitle] = useState('')
  const [keyword, setKeyword] = useState('')
  const [styleKey, setStyleKey] = useState('ap')
  const [angles, setAngles] = useState(REWRITE_ANGLES.map((a) => a.key))
  const [seed, setSeed] = useState(1)
  const { copied, copy } = useCopy()

  const results = useMemo(
    () => rewriteTitle(title, { seed, style: styleKey, keyword, angles }),
    [title, seed, styleKey, keyword, angles],
  )

  const original = useMemo(() => (title.trim() ? scoreHeadline(title) : null), [title])

  const toggleAngle = (key) =>
    setAngles((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]))

  const canResetRewriter =
    Boolean(title || keyword) || styleKey !== 'ap' || angles.length !== REWRITE_ANGLES.length

  const resetRewriter = () => {
    setTitle('')
    setKeyword('')
    setStyleKey('ap')
    setAngles(REWRITE_ANGLES.map((a) => a.key))
    setSeed(1)
    document.getElementById('tr-title')?.focus()
  }

  return (
    <ToolShell
      path="/tools/ai-title-rewriter"
      howTo={{
        steps: [
          'Paste the title you already have.',
          'Add your target keyword if you want the SEO version to put it first.',
          'Switch off any angles you do not need.',
          'Compare the character counts. The colour tells you if the title will fit in a Google result.',
        ],
      }}
      faqs={[
        {
          q: 'How is this different from a title generator?',
          a: 'A generator makes new titles from a topic. A rewriter starts from a title you have already written and shows the same idea in nine different ways, so you can see which one suits where you are posting it.',
        },
        {
          q: 'Which version should I use?',
          a: 'It depends on where the title will appear. Use the SEO version for a page title tag. Use the question version for pages meant to rank in search. Use the benefit version for a landing page, the list version for social media, and the academic version for anything being marked.',
        },
        {
          q: 'Does it change the meaning of my title?',
          a: 'It keeps your subject and changes the framing around it. Always read the result before using it. A title that promises something your page does not give will lose you more from people leaving than it gains from clicks.',
        },
        {
          q: 'Can I use these for A/B testing?',
          a: 'Yes, that is exactly what they are for. Choose two versions that differ in approach, not just in wording — for example a question against a benefit line. Testing two nearly identical titles almost never gives a clear answer.',
        },
      ]}
      about={`
        <h2>The nine angles</h2>
        <p>Each version uses a different approach, not just different words:</p>
        <ul>
          <li><strong>Clearer</strong> — removes filler words and weak phrases.</li>
          <li><strong>SEO</strong> — puts the keyword first and aims for under 60 characters.</li>
          <li><strong>Question</strong> — matches the way people actually type into Google.</li>
          <li><strong>How-to</strong> — turns it into a clear instruction.</li>
          <li><strong>List</strong> — adds a number, which reliably gets more clicks.</li>
          <li><strong>Benefit</strong> — starts with the result instead of the topic.</li>
          <li><strong>Curiosity</strong> — creates interest without over-promising.</li>
          <li><strong>Academic</strong> — a neutral tone for essays and journals.</li>
          <li><strong>Shortest</strong> — the tightest version that still makes sense.</li>
        </ul>
        <h2>How to read the character counts</h2>
        <p>Green means the title fits fully inside a Google search result. Orange means it will probably be cut on a phone. Red means the second half will not be seen at all, so move anything important to the front or make it shorter.</p>
      `}
    >
      <div className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Field label="Your current title" htmlFor="tr-title">
            <input
              id="tr-title"
              className="field text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Some really useful tips for editing your writing"
            />
          </Field>
        </div>
        <Field label="Target keyword" hint="Optional" htmlFor="tr-kw">
          <input id="tr-kw" className="field" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </Field>
        <Field label="Capitalization style" htmlFor="tr-style">
          <Select id="tr-style" value={styleKey} onChange={setStyleKey} options={STYLE_OPTIONS} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {REWRITE_ANGLES.map((angle) => (
          <button
            key={angle.key}
            type="button"
            onClick={() => toggleAngle(angle.key)}
            title={angle.note}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition ${
              angles.includes(angle.key)
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-gray-300 bg-white text-ink-700 hover:border-brand-400'
            }`}
          >
            {angle.label}
          </button>
        ))}
        <button type="button" className="btn-ghost !py-1 !text-xs" onClick={() => setSeed(newSeed())}>
          <Icon.refresh />
          Reshuffle
        </button>
        <button
          type="button"
          className="btn-ghost !py-1 !text-xs"
          onClick={resetRewriter}
          disabled={!canResetRewriter}
          title="Clear the title, the keyword and every option"
        >
          <Icon.trash />
          Reset
        </button>
      </div>

      {original && (
        <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-bold tracking-wide text-ink-500 uppercase">Original</p>
          <p className="mt-1 text-[15px] font-medium text-ink-900">{title}</p>
          <p className="mt-1 text-xs text-ink-500">
            {original.characters} characters · {original.words} words · scores {original.score}/100
          </p>
        </div>
      )}

      <div className="mt-5">
        {results.length === 0 ? (
          <Callout>Paste your title in the box above to see the rewrites.</Callout>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink-900">{results.length} rewrites</h2>
              <button
                type="button"
                className="btn-secondary !py-1.5 !text-xs"
                onClick={() => copy(results.map((r) => `${r.label}: ${r.title}`).join('\n'))}
              >
                {copied ? <Icon.check /> : <Icon.copy />}
                {copied ? 'Copied all' : 'Copy all'}
              </button>
            </div>
            <ul className="space-y-3">
              {results.map((result) => (
                <li key={result.key} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip">{result.label}</span>
                    <span className={`text-xs font-semibold tabular-nums ${lengthTone(result.length, 60)}`}>
                      {result.length} chars
                    </span>
                    <span className="chip">{scoreHeadline(result.title).score}/100</span>
                    <span className="ml-auto">
                      <CopyButton value={result.title} label="Copy" className="btn-ghost !px-2 !py-1 !text-xs" />
                    </span>
                  </div>
                  <p className="mt-2 text-[15px] font-medium text-ink-900">{result.title}</p>
                  <p className="mt-1 text-xs text-ink-500">{result.note}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </ToolShell>
  )
}
