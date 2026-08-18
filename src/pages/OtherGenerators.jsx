import { useEffect, useMemo, useState } from 'react'
import ToolShell from '../components/ToolShell.jsx'
import {
  Callout,
  CopyButton,
  DownloadButton,
  EmptyState,
  Field,
  Icon,
  LoadingState,
  NumberInput,
  OutputBox,
  ResetButton,
  ResultsHeader,
  Select,
  StatGrid,
  Toggle,
  resetControls,
  useCopy,
  useGenerator,
} from '../components/ui.jsx'
import {
  generateBackstory,
  generateFortune,
  generatePoem,
  generateSong,
  randomStates,
  repeatText,
  REGIONS,
} from '../lib/generators.js'
import { INVISIBLE_CHARACTERS } from '../lib/unicode.js'
import { requestPrompts, requestSpeech } from '../lib/aiService.js'

/**
 * Every generator on this page shares the same controls row.
 *
 * `generated` switches the wording: "Generate again" is confusing on a page
 * that has not generated anything yet, which is exactly what the visitor sees
 * first.
 */
function GenerateBar({ onRegenerate, children, label, againLabel, generated, busy, reset, dirty }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      {children}
      <button type="button" className="btn-primary" onClick={onRegenerate} disabled={busy}>
        {busy ? <Icon.spinner /> : <Icon.refresh />}
        {busy ? 'Working…' : generated ? againLabel || `${label} again` : label}
      </button>
      {reset && <ResetButton reset={reset} dirty={dirty} />}
    </div>
  )
}

/* ================================================================== */
/* Fortune Cookie Generator                                            */
/* ================================================================== */

export function FortuneCookie() {
  const { seed, generated, generate, field } = useGenerator()
  const [batch, setBatch] = useState(1)

  const fortunes = useMemo(
    () => (seed ? Array.from({ length: batch }, (_, i) => generateFortune({ seed: seed + i })) : []),
    [seed, batch],
  )

  const { dirty, reset } = resetControls([field, [batch, setBatch, 1]])

  const printable = fortunes
    .map((f) => `${f.fortune}\nLucky numbers: ${f.luckyNumbers.join(' · ')}\n${f.lesson}`)
    .join('\n\n———\n\n')

  return (
    <ToolShell
      path="/tools/fortune-cookie-generator"
      howTo={{
        steps: [
          'Click the button to open a new cookie.',
          'Increase the number to make a whole sheet at once.',
          'Copy or download them, then print and cut them into strips.',
          'Each fortune comes with six lucky numbers and a word to learn.',
        ],
      }}
      faqs={[
        {
          q: 'Are fortune cookies actually Chinese?',
          a: 'No. They became popular in California in the early 1900s, most likely started by Japanese-American bakers. They are almost unknown in China itself. When a US company tried selling them there in the 1990s, they were sold as a new American item.',
        },
        {
          q: 'Can I use these fortunes commercially?',
          a: 'Yes. All the fortunes are written by us and have no restrictions. Use them in classrooms, party gifts, packaging, games or apps.',
        },
        {
          q: 'How are the lucky numbers chosen?',
          a: 'Six different numbers between 1 and 60 are picked at random and then sorted. They are as random as any lottery quick pick, which means they are no more likely to win than any other numbers.',
        },
        {
          q: 'How do I print a sheet of these?',
          a: 'Set the number to 20 or more, click Download, and print the text file. A line separates each fortune, so you can cut them into strips easily.',
        },
      ]}
      about={`
        <h2>What makes a fortune land</h2>
        <p>The best fortunes are not predictions. They are small observations that feel personal but are true for almost everyone. "The work you keep postponing is smaller than you think" works because everybody has such a task waiting. Real predictions age badly and are forgotten before you leave the restaurant.</p>
        <h2>Uses beyond dessert</h2>
        <ul>
          <li><strong>Classrooms</strong> — one line a day for the board or the morning assembly.</li>
          <li><strong>Party gifts</strong> — print, cut and roll them into small place cards.</li>
          <li><strong>Writing practice</strong> — take a fortune as the last line of a scene and write backwards from it.</li>
          <li><strong>Team meetings</strong> — open one at the start, to get people talking.</li>
        </ul>
      `}
    >
      <GenerateBar
        onRegenerate={generate}
        label="Crack a cookie"
        againLabel="Crack another"
        generated={generated}
        reset={reset}
        dirty={dirty}
      >
        <div className="w-36">
          <Field label="How many" htmlFor="fc-batch">
            <NumberInput id="fc-batch" value={batch} onChange={setBatch} min={1} max={50} />
          </Field>
        </div>
      </GenerateBar>

      {!generated && <EmptyState>Press “Crack a cookie” to open your first fortune.</EmptyState>}

      <ul className="mt-6 space-y-4">
        {fortunes.map((fortune, i) => (
          <li key={`${seed}-${i}`} className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
            <p className="text-lg leading-8 font-medium text-ink-900">“{fortune.fortune}”</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-700">
              <span>
                <strong>Lucky numbers:</strong>{' '}
                <span className="font-mono tabular-nums">{fortune.luckyNumbers.join(' · ')}</span>
              </span>
              <span>{fortune.lesson}</span>
              <CopyButton value={fortune.fortune} label="Copy" className="btn-ghost !px-2 !py-1 !text-xs" />
            </div>
          </li>
        ))}
      </ul>

      {batch > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton value={printable} label="Copy all fortunes" />
          <DownloadButton value={printable} filename="fortunes.txt" />
        </div>
      )}
    </ToolShell>
  )
}

/* ================================================================== */
/* Invisible Character Generator                                       */
/* ================================================================== */

export function InvisibleCharacter() {
  const [repeat, setRepeat] = useState(1)
  const { copy } = useCopy()
  const [copiedCode, setCopiedCode] = useState(null)

  const { dirty, reset } = resetControls([[repeat, setRepeat, 1]])

  const onCopy = (char, code) => {
    copy(char.repeat(repeat))
    setCopiedCode(code)
    setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 1800)
  }

  return (
    <ToolShell
      path="/tools/invisible-character"
      howTo={{
        steps: [
          'Choose how many copies of the character you need.',
          'Click Copy next to the one you want. The Hangul filler works in the most places.',
          'Paste it wherever you need a blank value.',
          'If that field rejects it, try the next character in the list.',
        ],
      }}
      faqs={[
        {
          q: 'Which invisible character should I use?',
          a: 'Start with the Hangul filler (U+3164). It is a real character, not a space, so it survives the "this field is required" check that removes normal blank spaces. If an app blocks it, try the braille blank (U+2800) next.',
        },
        {
          q: 'Why did my blank name get rejected?',
          a: 'Most apps remove spaces from the start and end, and then check if anything is left. Zero-width and space characters get removed at that step. Invisible characters that are not spaces, like the Hangul filler and braille blank, usually get through.',
        },
        {
          q: 'Is using an invisible character against the rules?',
          a: 'It depends on the app. Most social networks allow blank names and messages. Some games and forums ban them, usually under rules about hiding your identity. Check the rules before you depend on it for anything important.',
        },
        {
          q: 'Can invisible characters be used maliciously?',
          a: 'Yes, and that is why some apps remove them. Zero-width characters can hide text inside a message, break up banned words, or secretly mark copied text. Careful systems clean them out of anything a user types.',
        },
      ]}
      about={`
        <h2>What each character actually is</h2>
        <p>"Invisible" means two different things here. <strong>Zero-width characters</strong> take no space at all. They exist to control how letters join together, and Indian scripts like Devanagari use them for exactly this. <strong>Blank characters</strong> like the Hangul filler and braille blank are ordinary characters that simply draw nothing, which is why a form treats them as real content.</p>
        <h2>Legitimate uses</h2>
        <ul>
          <li>Making a blank line where an app removes empty paragraphs.</li>
          <li>Filling a space in a design mockup.</li>
          <li>Stopping an app from turning your text into an emoji or a link.</li>
          <li>Testing how your own forms handle strange input.</li>
        </ul>
      `}
    >
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="w-40">
          <Field label="Copies to copy" htmlFor="ic-repeat">
            <NumberInput id="ic-repeat" value={repeat} onChange={setRepeat} min={1} max={200} />
          </Field>
        </div>
        <ResetButton reset={reset} dirty={dirty} />
      </div>

      <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {INVISIBLE_CHARACTERS.map((item) => (
          <li key={item.code} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-900">{item.name}</p>
              <p className="text-xs text-ink-500">
                <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">{item.code}</code> · {item.note}
              </p>
            </div>
            <span className="rounded border border-dashed border-gray-300 px-4 py-1 font-mono text-sm text-gray-400">
              [{item.char}]
            </span>
            <button
              type="button"
              className={copiedCode === item.code ? 'btn-primary shrink-0' : 'btn-secondary shrink-0'}
              onClick={() => onCopy(item.char, item.code)}
            >
              {copiedCode === item.code ? <Icon.check /> : <Icon.copy />}
              {copiedCode === item.code ? 'Copied' : 'Copy'}
            </button>
          </li>
        ))}
      </ul>
    </ToolShell>
  )
}

/* ================================================================== */
/* Random State Generator                                              */
/* ================================================================== */

export function RandomState() {
  const [count, setCount] = useState(1)
  const [region, setRegion] = useState('all')
  const [showCapital, setShowCapital] = useState(true)
  const { seed, generated, generate, field } = useGenerator()

  const states = useMemo(() => (seed ? randomStates({ count, region, seed }) : []), [count, region, seed])

  const { dirty, reset } = resetControls([
    [count, setCount, 1],
    [region, setRegion, 'all'],
    [showCapital, setShowCapital, true],
    field,
  ])

  return (
    <ToolShell
      path="/tools/random-state-generator"
      howTo={{
        steps: [
          'Choose how many states you want. None of them will repeat.',
          'Use the region filter if you only want the South, Midwest, Northeast or West.',
          'Click Generate again to pick a new set.',
          'Copy the list for a quiz, a lesson plan or a giveaway.',
        ],
      }}
      faqs={[
        {
          q: 'How random is the draw?',
          a: 'Each state is removed from the pool once it is picked, so you never get the same one twice in a single draw. Every state has an equal chance, whatever its size or population.',
        },
        {
          q: 'Which regions do you use?',
          a: 'The four official US Census regions: Northeast, Midwest, South and West. This is the grouping the US government uses. It does place a few states, like Delaware and Maryland, in the South, where many people do not expect them.',
        },
        {
          q: 'Does this include DC and the territories?',
          a: 'No, only the 50 states. Washington DC, Puerto Rico, Guam and the other US territories are not included.',
        },
        {
          q: 'What can I use this for?',
          a: 'Geography quizzes, classroom warm-ups, choosing a road trip destination, giving each student a state for a project, picking a region for a giveaway, and making test data for anything that needs a US address.',
        },
      ]}
      about={`
        <h2>Ideas for teachers</h2>
        <ul>
          <li><strong>Capitals practice</strong> — draw five states and ask students to name the capitals before you show them.</li>
          <li><strong>Research task</strong> — give each student one state and ask for a one-page write-up.</li>
          <li><strong>Region sorting</strong> — draw ten with the region hidden, and let the class group them.</li>
          <li><strong>Timeline</strong> — draw a few and put them in the order they joined the country.</li>
        </ul>
      `}
    >
      <GenerateBar
        onRegenerate={generate}
        label="Draw states"
        againLabel="Draw again"
        generated={generated}
        reset={reset}
        dirty={dirty}
      >
        <div className="w-32">
          <Field label="How many" htmlFor="rs-count">
            <NumberInput id="rs-count" value={count} onChange={setCount} min={1} max={50} />
          </Field>
        </div>
        <div className="w-48">
          <Field label="Region" htmlFor="rs-region">
            <Select
              id="rs-region"
              value={region}
              onChange={setRegion}
              options={REGIONS.map((r) => ({ value: r, label: r === 'all' ? 'All regions' : r }))}
            />
          </Field>
        </div>
        <div className="pb-2">
          <Toggle checked={showCapital} onChange={setShowCapital} label="Show capitals" />
        </div>
      </GenerateBar>

      {!generated ? (
        <EmptyState>Press “Draw states” to pick your states.</EmptyState>
      ) : (
        <>
          <ResultsHeader count={states.length} noun="state">
            <CopyButton
              value={states.map((s) => (showCapital ? `${s.name} (${s.abbr}) — ${s.capital}` : s.name)).join('\n')}
              label="Copy list"
              className="btn-secondary !py-1.5 !text-xs"
            />
          </ResultsHeader>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {states.map((state) => (
              <li
                key={state.abbr}
                className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
              >
                <p className="text-lg font-bold text-ink-900">{state.name}</p>
                <p className="mt-0.5 text-sm text-ink-500">
                  {state.abbr} · {state.region}
                </p>
                {showCapital && <p className="mt-1 text-sm text-ink-700">Capital: {state.capital}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
    </ToolShell>
  )
}

/* ================================================================== */
/* Prompts Generator                                                   */
/* ================================================================== */

export function PromptGenerator() {
  const [kind, setKind] = useState('text')
  const [subject, setSubject] = useState('')
  const [count, setCount] = useState(6)
  const { seed, generated, generate, field } = useGenerator()

  // See the speech generator for why `busy` is derived rather than a flag.
  const asked = seed ? JSON.stringify({ kind, subject, count, seed }) : ''
  const [answer, setAnswer] = useState({ asked: '', prompts: [] })
  const busy = Boolean(asked) && answer.asked !== asked
  const prompts = answer.asked === asked ? answer.prompts : []

  // The prompts are written by the model when a key is configured, because a
  // template can only drop the subject into a fixed sentence — which is no use
  // at all once the subject is a phrase, or is not in English.
  useEffect(() => {
    if (!asked) return undefined

    // A slow reply for an older press must not overwrite a newer one.
    let current = true
    requestPrompts({ kind, subject, count, seed }).then((result) => {
      if (current) setAnswer({ asked, prompts: result.prompts })
    })

    return () => {
      current = false
    }
  }, [asked])

  const { dirty, reset } = resetControls([
    [kind, setKind, 'text'],
    [subject, setSubject, ''],
    [count, setCount, 6],
    field,
  ])

  return (
    <ToolShell
      path="/tools/prompt-generator"
      howTo={{
        steps: [
          'Choose text prompts for chat tools, or image prompts for image tools.',
          'Add a subject to focus the prompts, or leave it empty for variety.',
          'Generate a batch and copy the one closest to what you need.',
          'Then edit it. A generated prompt is a starting shape, not a finished instruction.',
        ],
      }}
      faqs={[
        {
          q: 'What makes a good AI prompt?',
          a: 'Four parts: a role for the AI to take, one clear task, rules about how it should work, and the format you want the answer in. Missing any one of these is what gives you long, vague answers.',
        },
        {
          q: 'Do these work with every AI model?',
          a: 'The text prompts are plain English with no special code, so they work the same in ChatGPT, Claude, Gemini and others. The image prompts use the comma-separated style that Midjourney, Stable Diffusion and DALL·E all understand.',
        },
        {
          q: 'Why does "act as a [role]" help?',
          a: 'It narrows down the answer. An AI asked to "improve this text" gives you an average of every kind of improvement it has ever seen. Asked to answer "as a technical editor", it uses one clear set of standards instead.',
        },
        {
          q: 'Should I use the prompt exactly as generated?',
          a: 'Use it as a frame. The structure is the useful part. Put in your own role, task and rules. A generated prompt gets you past the empty box, but the details of your own task are what make it actually work.',
        },
      ]}
      about={`
        <h2>Image prompts are different</h2>
        <p>Image tools do not read sentences the way chat tools do. They respond to a list of describing words: subject, camera angle, style, lighting, quality. The order matters, because words near the front carry more weight. And if you add two words that contradict each other, you get a mess, not a middle result.</p>
      `}
    >
      <GenerateBar
        onRegenerate={generate}
        label="Generate prompts"
        generated={generated}
        busy={busy}
        reset={reset}
        dirty={dirty}
      >
        <div className="w-44">
          <Field label="Prompt type" htmlFor="pg-kind">
            <Select
              id="pg-kind"
              value={kind}
              onChange={setKind}
              options={[
                { value: 'text', label: 'Text / chat prompts' },
                { value: 'image', label: 'Image prompts' },
              ]}
            />
          </Field>
        </div>
        <div className="min-w-[220px] flex-1">
          <Field label="Subject" hint="Optional" htmlFor="pg-subject">
            <input
              id="pg-subject"
              className="field"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={kind === 'image' ? 'an abandoned greenhouse' : 'customer onboarding'}
            />
          </Field>
        </div>
        <div className="w-28">
          <Field label="How many" htmlFor="pg-count">
            <NumberInput id="pg-count" value={count} onChange={setCount} min={1} max={30} />
          </Field>
        </div>
      </GenerateBar>

      {!generated ? (
        <EmptyState>Press “Generate prompts” to see your prompts.</EmptyState>
      ) : busy ? (
        <LoadingState rows={count}>Writing your prompts…</LoadingState>
      ) : (
        <>
          <ResultsHeader count={prompts.length} noun="prompt">
            <CopyButton value={prompts.join('\n\n')} label="Copy all" className="btn-secondary !py-1.5 !text-xs" />
            <DownloadButton
              value={prompts.join('\n\n')}
              filename="ai-prompts.txt"
              label="Download"
              className="btn-secondary !py-1.5 !text-xs"
            />
          </ResultsHeader>

          <ul className="space-y-3">
            {prompts.map((prompt, i) => (
              <li
                key={`${seed}-${i}`}
                className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 tabular-nums">
                  {i + 1}
                </span>
                <p className="min-w-0 flex-1 text-[15px] leading-7 text-ink-900">{prompt}</p>
                <CopyButton
                  value={prompt}
                  label=""
                  className="btn-ghost shrink-0 !px-2 !py-1 opacity-60 transition group-hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </ToolShell>
  )
}

/* ================================================================== */
/* Text Repeater                                                       */
/* ================================================================== */

export function TextRepeater() {
  const [text, setText] = useState('')
  const [times, setTimes] = useState(10)
  const [separator, setSeparator] = useState('\n')
  const [numbered, setNumbered] = useState(false)
  const [reverse, setReverse] = useState(false)

  const output = useMemo(
    () => repeatText(text, { times, separator, numbered, reverse }),
    [text, times, separator, numbered, reverse],
  )

  const { dirty, reset } = resetControls([
    [text, setText, ''],
    [times, setTimes, 10],
    [separator, setSeparator, '\n'],
    [numbered, setNumbered, false],
    [reverse, setReverse, false],
  ])

  return (
    <ToolShell
      path="/tools/text-repeater"
      howTo={{
        steps: [
          'Type or paste the text you want to repeat.',
          'Set how many copies you need.',
          'Choose what goes between them: a new line, a space, a comma, or nothing.',
          'Copy the result, or download it as a file.',
        ],
      }}
      faqs={[
        {
          q: 'Is there a limit on how many times I can repeat text?',
          a: 'The limit is 10,000 copies, so your browser stays fast. For a single word that is about 60,000 characters, which is more than any input box will accept anyway.',
        },
        {
          q: 'Can I number each repetition?',
          a: 'Yes. Turn on numbering and each line starts with 1., 2., 3. and so on. This is useful for test data, sample lists and numbered items.',
        },
        {
          q: 'What is this actually useful for?',
          a: 'Making test data, filling a design to see what happens when text overflows, repeating a block of code or settings, and quickly making a numbered list of sample items.',
        },
        {
          q: 'Why does my repeated text get rejected by chat apps?',
          a: 'Most messaging apps look for repeated identical content and treat it as spam. Sending a wall of repeated text can get your message blocked or your account limited. Use this for testing and data, not for chatting.',
        },
      ]}
      about={`
        <h2>Common uses</h2>
        <ul>
          <li><strong>Layout testing</strong> — repeat a paragraph until the box overflows, to see how scrolling and cutting behave.</li>
          <li><strong>Test data</strong> — numbered copies make a quick sample list for a table or a dropdown.</li>
          <li><strong>Code and settings</strong> — repeat one block, then edit only the parts that differ.</li>
          <li><strong>Character limit testing</strong> — build text of an exact length to check a form validation.</li>
        </ul>
      `}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <Field label="Text to repeat" htmlFor="tr-text">
            <textarea
              id="tr-text"
              rows={5}
              className="field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type anything"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Repeat how many times" htmlFor="tr-times">
              <NumberInput id="tr-times" value={times} onChange={setTimes} min={1} max={10000} />
            </Field>
            <Field label="Separator" htmlFor="tr-sep">
              <Select
                id="tr-sep"
                value={separator}
                onChange={setSeparator}
                options={[
                  { value: '\n', label: 'New line' },
                  { value: ' ', label: 'Space' },
                  { value: ', ', label: 'Comma + space' },
                  { value: '', label: 'Nothing' },
                  { value: ' | ', label: 'Pipe' },
                  { value: '\n\n', label: 'Blank line' },
                ]}
              />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Toggle checked={numbered} onChange={setNumbered} label="Number each line" />
            <Toggle checked={reverse} onChange={setReverse} label="Reverse order" />
            <span className="ml-auto">
              <ResetButton reset={reset} dirty={dirty} />
            </span>
          </div>
          <StatGrid
            stats={[
              { label: 'Characters', value: output.length.toLocaleString() },
              { label: 'Lines', value: output ? output.split('\n').length : 0 },
            ]}
          />
        </div>

        <Field label="Result">
          <OutputBox value={output} rows={16} mono />
        </Field>
      </div>
    </ToolShell>
  )
}

/* ================================================================== */
/* Speech Generator                                                    */
/* ================================================================== */

export function SpeechGenerator() {
  const [topic, setTopic] = useState('')
  const [occasion, setOccasion] = useState('a conference talk')
  const [minutes, setMinutes] = useState(3)
  const { seed, generated, generate, field } = useGenerator()

  // What was asked for, as one comparable value. `busy` is derived from it
  // rather than kept in its own flag: a flag is only set once the effect runs,
  // which is a render later, and in that gap the page shows an empty result
  // box instead of the loader.
  const asked = seed ? JSON.stringify({ topic, occasion, minutes, seed }) : ''
  const [answer, setAnswer] = useState({ asked: '', speech: '' })
  const busy = Boolean(asked) && answer.asked !== asked
  const speech = answer.asked === asked ? answer.speech : ''

  // Written by the model when a key is configured. The template version can
  // only slot the topic into a fixed frame, which reads as a form letter the
  // moment anyone actually says it out loud.
  useEffect(() => {
    if (!asked) return undefined

    // A slow reply for an older press must not overwrite a newer one.
    let current = true
    requestSpeech({ topic, occasion, minutes, seed }).then((result) => {
      if (current) setAnswer({ asked, speech: result.speech })
    })

    return () => {
      current = false
    }
  }, [asked])

  const { dirty, reset } = resetControls([
    [topic, setTopic, ''],
    [occasion, setOccasion, 'a conference talk'],
    [minutes, setMinutes, 3],
    field,
  ])

  return (
    <ToolShell
      path="/tools/speech-generator"
      howTo={{
        steps: [
          'Type what the speech is about.',
          'Choose the occasion. A wedding speech and a conference talk need different shapes.',
          'Set the length in minutes. About 130 words is one minute of speaking.',
          'Generate it, then replace the example stories with your own. Only you can write that part.',
        ],
      }}
      faqs={[
        {
          q: 'How many words is a five-minute speech?',
          a: 'About 650 words. Most people speak at 120 to 150 words a minute on stage, which is slower than normal talking because you pause more. Plan for 130 words a minute and you will be close.',
        },
        {
          q: 'How should a speech open?',
          a: 'With something solid: a moment, a number, or an honest admission. "I want to start with something I got wrong" works far better than "Thank you all for coming", because it gives people a reason to keep listening.',
        },
        {
          q: 'How many points should a speech have?',
          a: 'Three, for anything under ten minutes. People remember the shape of a talk, not the details. A fourth point almost always pushes out one of the first three instead of adding to them.',
        },
        {
          q: 'Should I read from a script?',
          a: 'Write the full script first, so your thinking is clear. Then speak from a small card with only the opening line, the linking lines and the closing line. Reading word for word makes you sound flat. Having nothing at all makes you wander.',
        },
      ]}
      about={`
        <h2>The shape of a talk that works</h2>
        <ol>
          <li><strong>Opening</strong> — one solid thing, 20 seconds. No long greetings, no agenda slide.</li>
          <li><strong>Why it matters</strong> — and why it matters to these people, in this room.</li>
          <li><strong>Three points</strong> — each with one story or one number. Never both together.</li>
          <li><strong>The doubt</strong> — say the objection they are already thinking, before they can say it.</li>
          <li><strong>Close</strong> — what you want them to do. One plain sentence, then stop.</li>
        </ol>
        <h2>The part a generator cannot do</h2>
        <p>A tool can give you the structure. It cannot give you the stories. People remember a talk for one exact moment described in detail — the meeting where everything went wrong, the exact words a customer used. Use the outline below as a frame and put your own material into the gaps.</p>
      `}
    >
      <GenerateBar
        onRegenerate={generate}
        label="Write the speech"
        againLabel="Write another"
        generated={generated}
        busy={busy}
        reset={reset}
        dirty={dirty}
      >
        <div className="min-w-[220px] flex-1">
          <Field label="Topic" htmlFor="sp-topic">
            <input
              id="sp-topic"
              className="field"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="why our onboarding is broken"
            />
          </Field>
        </div>
        <div className="w-56">
          <Field label="Occasion" htmlFor="sp-occasion">
            <Select
              id="sp-occasion"
              value={occasion}
              onChange={setOccasion}
              options={[
                'a conference talk',
                'a team all-hands',
                'a wedding toast',
                'a graduation speech',
                'a retirement send-off',
                'a pitch to investors',
                'a school assembly',
                'a eulogy',
              ]}
            />
          </Field>
        </div>
        <div className="w-32">
          <Field label="Minutes" htmlFor="sp-min">
            <NumberInput id="sp-min" value={minutes} onChange={setMinutes} min={1} max={20} />
          </Field>
        </div>
      </GenerateBar>

      {!generated ? (
        <EmptyState>Press “Write the speech” to see your speech.</EmptyState>
      ) : busy ? (
        <LoadingState rows={3}>Writing your speech…</LoadingState>
      ) : (
        <div className="mt-6">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="label mb-0">Your speech</span>
            <span className="text-xs text-ink-500">
              ~{speech.trim().split(/\s+/).length} words · about{' '}
              {Math.max(1, Math.round(speech.trim().split(/\s+/).length / 130))} min spoken
            </span>
          </div>
          <pre className="rounded-lg border border-gray-200 bg-white p-5 text-[15px] leading-8 whitespace-pre-wrap text-ink-900">
            {speech}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton value={speech} label="Copy speech" className="btn-primary" />
            <DownloadButton value={speech} filename="speech.txt" />
          </div>
        </div>
      )}
    </ToolShell>
  )
}

/* ================================================================== */
/* Song Generator                                                      */
/* ================================================================== */

export function SongGenerator() {
  const [theme, setTheme] = useState('')
  const [genre, setGenre] = useState('indie')
  const { seed, generated, generate, field } = useGenerator()

  const song = useMemo(() => (seed ? generateSong({ theme, genre, seed }) : ''), [theme, genre, seed])

  const { dirty, reset } = resetControls([[theme, setTheme, ''], [genre, setGenre, 'indie'], field])

  return (
    <ToolShell
      path="/tools/song-generator"
      howTo={{
        steps: [
          'Type a theme. An object, a place or a feeling works better than a vague word.',
          'Pick a style to guide the images used.',
          'Generate the full structure: two verses, a repeating chorus, a bridge and an ending.',
          'Keep the two or three lines that surprise you, and rewrite the rest yourself.',
        ],
      }}
      faqs={[
        {
          q: 'What is the standard song structure?',
          a: 'Verse, chorus, verse, chorus, bridge, chorus. This is the standard shape in pop and film music, and it is what this tool makes. The verses carry the story. The chorus carries the hook and repeats without changing. The bridge gives one different moment before the last chorus.',
        },
        {
          q: 'How long should a chorus be?',
          a: 'Four lines, and it should contain the title of the song. The title line usually comes first or last in the chorus, and it should be the line people hear most often.',
        },
        {
          q: 'Can I use these lyrics commercially?',
          a: 'Yes. The lines are built from our own patterns and have no restrictions. In practice you will rewrite most of them anyway. The real value is getting past the blank page.',
        },
        {
          q: 'How do I find rhymes for the lines I keep?',
          a: 'Use the rhyming dictionary on this site. Scroll past the perfect rhymes to the slant rhymes. That is where most modern songwriting lives, because a perfect rhyme can be guessed a line in advance.',
        },
      ]}
      about={`
        <h2>Verse, chorus, bridge — what each does</h2>
        <ul>
          <li><strong>Verse</strong> — something new every time. The verses move the story forward.</li>
          <li><strong>Chorus</strong> — exactly the same every time. It holds the main feeling and the title.</li>
          <li><strong>Pre-chorus</strong> — optional. Four lines that build up into the chorus.</li>
          <li><strong>Bridge</strong> — one change: a new view, a jump in time, or a confession. It must not be a third verse in disguise.</li>
          <li><strong>Ending</strong> — usually a quieter piece of the chorus.</li>
        </ul>
        <h2>Working with generated lines</h2>
        <p>Treat every line as an idea, not a finished lyric. The useful part is usually one unexpected image in the second verse, which shows you where the song actually wants to go. Keep that line, throw away the rest, and write outwards from it.</p>
      `}
    >
      <GenerateBar
        onRegenerate={generate}
        label="Write the song"
        againLabel="Write another"
        generated={generated}
        reset={reset}
        dirty={dirty}
      >
        <div className="min-w-[220px] flex-1">
          <Field label="Theme" htmlFor="sg-theme">
            <input
              id="sg-theme"
              className="field"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="a harbour, leaving home, an old car"
            />
          </Field>
        </div>
        <div className="w-48">
          <Field label="Genre" htmlFor="sg-genre">
            <Select
              id="sg-genre"
              value={genre}
              onChange={setGenre}
              options={['indie', 'folk', 'country', 'pop', 'rock', 'r&b', 'hip-hop', 'ballad']}
            />
          </Field>
        </div>
      </GenerateBar>

      {!generated ? (
        <EmptyState>Press “Write the song” to see your lyrics.</EmptyState>
      ) : (
        <div className="mt-6">
          <pre className="rounded-lg border border-gray-200 bg-white p-5 text-[15px] leading-8 whitespace-pre-wrap text-ink-900">
            {song}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton value={song} label="Copy lyrics" className="btn-primary" />
            <DownloadButton value={song} filename="song.txt" />
          </div>
        </div>
      )}
    </ToolShell>
  )
}

/* ================================================================== */
/* Poem Generator                                                      */
/* ================================================================== */

export function PoemGenerator() {
  const [theme, setTheme] = useState('')
  const [form, setForm] = useState('free')
  const [stanzas, setStanzas] = useState(3)
  const { seed, generated, generate, field } = useGenerator()

  const poem = useMemo(
    () => (seed ? generatePoem({ theme, form, stanzas, seed }) : ''),
    [theme, form, stanzas, seed],
  )

  const { dirty, reset } = resetControls([
    [theme, setTheme, ''],
    [form, setForm, 'free'],
    [stanzas, setStanzas, 3],
    field,
  ])

  return (
    <ToolShell
      path="/tools/poem-generator"
      howTo={{
        steps: [
          'Type a theme, or leave it empty and see what comes out.',
          'Choose free verse for stanzas, or the short form for three lines.',
          'Keep generating until one line makes you stop.',
          'Copy that line and write your own poem outwards from it.',
        ],
      }}
      faqs={[
        {
          q: 'Can a generator write a real poem?',
          a: 'No, and it is not trying to. What it can do is put words together in ways you would not have chosen, and that breaks you out of your usual habits. The value is in the one line that makes you think "no, but almost".',
        },
        {
          q: 'What is free verse?',
          a: 'Poetry with no fixed rhythm and no rhyme scheme. It has been the main form in English poetry for over a hundred years. Free does not mean careless. Line breaks, rhythm and space on the page are still chosen on purpose.',
        },
        {
          q: 'What are the rules for a haiku?',
          a: 'In English the usual rule is three lines of five, seven and five syllables. Traditional Japanese haiku also need a season word and a turning point. Most people keep only the syllable counts.',
        },
        {
          q: 'How do I turn this into an actual poem?',
          a: 'Take one line and ask what must be true for someone to say it. Who is speaking? To whom? What have they just lost? That one question gives you far more usable material than generating more lines.',
        },
      ]}
      about={`
        <h2>Using generated lines as prompts</h2>
        <p>The most useful thing a random line does is give you an image you would never have chosen. Your own writing has habits: favourite words, familiar rhythms, the same few images. A generated line ignores all of them, and that small discomfort is where new material comes from.</p>
        <h2>Three exercises</h2>
        <ol>
          <li><strong>Last line first.</strong> Take one line, make it the ending, and write the poem that leads to it.</li>
          <li><strong>Argue with it.</strong> Write a poem that disagrees with the generated line.</li>
          <li><strong>Keep one word.</strong> Take the strangest word in the result and write four lines that deserve it.</li>
        </ol>
      `}
    >
      <GenerateBar
        onRegenerate={generate}
        label="Write the poem"
        againLabel="Write another"
        generated={generated}
        reset={reset}
        dirty={dirty}
      >
        <div className="min-w-[200px] flex-1">
          <Field label="Theme" htmlFor="pm-theme">
            <input
              id="pm-theme"
              className="field"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="winter, distance, a kitchen"
            />
          </Field>
        </div>
        <div className="w-40">
          <Field label="Form" htmlFor="pm-form">
            <Select
              id="pm-form"
              value={form}
              onChange={setForm}
              options={[
                { value: 'free', label: 'Free verse' },
                { value: 'haiku', label: 'Three lines' },
              ]}
            />
          </Field>
        </div>
        {form === 'free' && (
          <div className="w-32">
            <Field label="Stanzas" htmlFor="pm-stanzas">
              <NumberInput id="pm-stanzas" value={stanzas} onChange={setStanzas} min={1} max={10} />
            </Field>
          </div>
        )}
      </GenerateBar>

      {!generated ? (
        <EmptyState>Press “Write the poem” to see your poem.</EmptyState>
      ) : (
        <div className="mt-6">
          <pre className="rounded-lg border border-gray-200 bg-white p-6 font-serif text-[17px] leading-9 whitespace-pre-wrap text-ink-900">
            {poem}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton value={poem} label="Copy poem" className="btn-primary" />
            <DownloadButton value={poem} filename="poem.txt" />
          </div>
        </div>
      )}
    </ToolShell>
  )
}

/* ================================================================== */
/* Character Backstory Generator                                       */
/* ================================================================== */

export function BackstoryGenerator() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('rogue')
  const [length, setLength] = useState('medium')
  const { seed, generated, generate, field } = useGenerator()

  const story = useMemo(
    () => (seed ? generateBackstory({ name, role, length, seed }) : null),
    [name, role, length, seed],
  )

  const { dirty, reset } = resetControls([
    [name, setName, ''],
    [role, setRole, 'rogue'],
    [length, setLength, 'medium'],
    field,
  ])

  const beatLabels = {
    origin: 'Origin',
    turningPoint: 'Turning point',
    skill: 'Defining skill',
    flaw: 'Flaw',
    want: 'What they want',
    secret: 'Secret',
  }

  return (
    <ToolShell
      path="/tools/character-backstory-generator"
      howTo={{
        steps: [
          'Type a name, or leave it empty and one will be made for you.',
          'Pick the character role or class.',
          'Choose how much detail you want.',
          'Read the six parts below: beginning, turning point, skill, flaw, goal and secret.',
        ],
      }}
      faqs={[
        {
          q: 'What makes a good D&D backstory?',
          a: 'One clear goal, one real flaw, and a secret the other players do not know. Long family histories and prophecies do not create good play. A goal the DM can dangle in front of you, and a flaw that costs you something at the wrong moment, absolutely do.',
        },
        {
          q: 'How long should a backstory be?',
          a: 'For a tabletop game, half a page. Most DMs read one paragraph properly and skim anything longer. What matters is that the useful hooks are easy to find, not that the history is complete.',
        },
        {
          q: 'Why does the generator include a flaw and a secret?',
          a: 'Because those two create the story. A skill tells the table what you can do. A flaw tells them what will go wrong. And a secret gives the DM something to reveal at the worst possible moment.',
        },
        {
          q: 'Can I use these for fiction rather than games?',
          a: 'Yes. These six parts are the same ones used in character-based fiction. The goal and the flaw in particular match the classic novel-writing idea of what a character wants against what they actually need.',
        },
      ]}
      about={`
        <h2>The six beats</h2>
        <ul>
          <li><strong>Beginning</strong> — where they come from, in one solid detail rather than a family tree.</li>
          <li><strong>Turning point</strong> — the event that made them the person your story begins with.</li>
          <li><strong>Main skill</strong> — what they are unusually good at. Ideally something ordinary, not heroic.</li>
          <li><strong>Flaw</strong> — a real one that costs them something. Not a strength pretending to be a weakness.</li>
          <li><strong>Goal</strong> — something clear and possible, which the story can then block.</li>
          <li><strong>Secret</strong> — the thing they would never say aloud, which the story can use later.</li>
        </ul>
        <h2>Making it playable</h2>
        <p>Give your DM or co-writer three named people from the backstory and one place. That is what turns a history into something usable: a person who can walk into a scene, a debt someone can demand back, and a town that can be put in danger.</p>
      `}
    >
      <GenerateBar
        onRegenerate={generate}
        label="Write the backstory"
        againLabel="Write another"
        generated={generated}
        reset={reset}
        dirty={dirty}
      >
        <div className="w-48">
          <Field label="Name" hint="Optional" htmlFor="bs-name">
            <input id="bs-name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>
        <div className="w-48">
          <Field label="Role or class" htmlFor="bs-role">
            <Select
              id="bs-role"
              value={role}
              onChange={setRole}
              options={['rogue', 'wizard', 'fighter', 'cleric', 'ranger', 'bard', 'paladin', 'druid', 'warlock', 'monk', 'detective', 'smuggler', 'archivist', 'physician', 'engineer']}
            />
          </Field>
        </div>
        <div className="w-40">
          <Field label="Detail" htmlFor="bs-len">
            <Select
              id="bs-len"
              value={length}
              onChange={setLength}
              options={[
                { value: 'short', label: 'Short' },
                { value: 'medium', label: 'Medium' },
                { value: 'long', label: 'Full six beats' },
              ]}
            />
          </Field>
        </div>
      </GenerateBar>

      {!story ? (
        <EmptyState>Press “Write the backstory” to see your character.</EmptyState>
      ) : (
        <div className="mt-6 space-y-5">
          <Callout title={story.name}>
            <p className="leading-7">{story.text}</p>
          </Callout>

          <div>
            <h2 className="mb-3 text-sm font-bold text-ink-900">The six beats</h2>
            <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
              {Object.entries(beatLabels).map(([key, label]) => (
                <li key={key} className="px-4 py-3">
                  <p className="text-xs font-bold tracking-wide text-brand-600 uppercase">{label}</p>
                  <p className="mt-1 text-[15px] leading-7 text-ink-900">{story.beats[key]}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <CopyButton value={story.text} label="Copy backstory" className="btn-primary" />
            <DownloadButton value={`${story.name}\n\n${story.text}`} filename="backstory.txt" />
          </div>
        </div>
      )}
    </ToolShell>
  )
}
