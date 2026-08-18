import { createRng, fillTemplate, pick, pickMany, randomInt, shuffle } from './random.js'
import {
  BACKSTORY_BANKS,
  BANK,
  FORTUNES,
  LOREM_WORDS,
  LUCKY_MESSAGES,
  NAME_BANKS,
  POEM_BANKS,
  POKEMON_BANKS,
  SONG_BANKS,
  SPEECH_BANKS,
  US_STATES,
} from './wordBank.js'
import { capitalizeTitle } from './capitalize.js'
import {
  ESSAY_GRADE_TEMPLATES,
  ESSAY_TYPE_TEMPLATES,
  GENRE_BANKS,
  POEM_TYPE_TEMPLATES,
  TONE_TEMPLATES,
} from './titleOptions.js'

const titled = (text, style = 'ap') => capitalizeTitle(text, style)

/* ------------------------------------------------------------------ */
/* Title generators                                                    */
/* ------------------------------------------------------------------ */

export const TITLE_TEMPLATES = {
  blog: [
    '{number} {powerWord} Ways to {topicVerb} {topic}',
    'How to {topicVerb} {topic} {timeframe}',
    'The {powerWord} {topic} {format} for {audience}',
    'Why Your {topic} Isn\'t Working (And How to Fix It)',
    '{topic}: A {format} for {audience}',
    'The Beginner\'s Guide to {topic}',
    '{number} {topic} Mistakes That Cost You Time',
    'What Nobody Tells You About {topic}',
    'Stop Guessing: A {powerWord} Approach to {topic}',
    '{topic} in {number} Steps — Even If You\'re Starting From Zero',
    'How I Learned to {topicVerb} {topic} {emotion}',
    'The Only {topic} {format} You Need {timeframe}',
  ],
  essay: [
    'The Role of {topic} in Shaping Modern Society',
    'Rethinking {topic}: Causes, Consequences and Corrections',
    'How {topic} Changed the Way We Understand {abstract}',
    'A Critical Examination of {topic}',
    'Between Theory and Practice: {topic} Reconsidered',
    'The Ethics of {topic} in the Twenty-First Century',
    '{topic} and Its Discontents',
    'Why {topic} Matters More Than We Admit',
    'From Margin to Centre: The Case for {topic}',
    'Competing Perspectives on {topic}: A Comparative Analysis',
    'The Unintended Consequences of {topic}',
    'Reading {topic} Through the Lens of {abstract}',
  ],
  book: [
    'The {adjective} {noun}',
    '{plural} of {place}',
    'The {noun} of {abstract}',
    'A {adjective} Kind of {abstract}',
    '{verbGerund} {plural}',
    'The Last {noun} in {place}',
    'What the {noun} Knew',
    'All the {adjective} {plural}',
    'The {season} of {plural}',
    '{place}: A Novel',
    'The {noun} Keeper\'s Daughter',
    'Where the {plural} Go',
    'Notes on a {adjective} {noun}',
    'The {noun} and the {noun}',
  ],
  poem: [
    '{abstract} in Late {season}',
    'Ode to a {adjective} {noun}',
    'On {verbGerund}',
    'The {noun} Speaks',
    'Letter to My {adjective} Self',
    'Elegy for the {noun}',
    '{number} Ways of Looking at a {noun}',
    'After the {noun}',
    'Aubade with {plural}',
    'Self-Portrait as a {noun}',
    'Small {abstract}',
    'What the {season} Left',
  ],
  youtube: [
    'I Tried {topic} for {number} Days — Here\'s What Happened',
    '{number} {topic} Tips I Wish I Knew Sooner',
    'The Truth About {topic} (Nobody Says This)',
    'How to {topicVerb} {topic} — Full Walkthrough',
    '{topic} for Beginners: Everything You Need to Know',
    'Why Your {topic} Fails (And the Fix)',
    'I Spent {number} Hours Learning {topic}',
    '{topic}: Before and After',
    'Do NOT {topicVerb} {topic} Until You Watch This',
    '{number} Minutes to Better {topic}',
    'Testing Every {topic} Method So You Don\'t Have To',
    'The {topic} Setup That Changed Everything',
  ],
  song: [
    '{adjective} {noun}',
    '{verbGerund} in the {noun}',
    'Don\'t Wait for the {season}',
    'Somebody Else\'s {noun}',
    'Back to {place}',
    'All My {plural}',
    '{abstract} on the Radio',
    'Tell Me About the {noun}',
    'Two {plural}, One {noun}',
    'Last Call in {place}',
  ],
  podcast: [
    'The {topic} {format}',
    'Talking {topic} with {audience}',
    '{topic}, Unfiltered',
    'The {adjective} Hour: Conversations About {topic}',
    'Off the Record: {topic}',
    '{number} Questions About {topic}',
  ],
  product: [
    '{businessPrefix}{businessSuffix}',
    'The {adjective} {topic} Kit',
    '{topic} Pro',
    '{topic} Studio',
    'Everyday {topic}',
  ],
}

export const TITLE_TONES = {
  neutral: (t) => t,
  listicle: (t) => (/^\d/.test(t) ? t : `${pick(createRng(t), BANK.number)} Things About ${t}`),
  question: (t) => (t.endsWith('?') ? t : `${t}?`),
  howto: (t) => (/^how/i.test(t) ? t : `How to ${t}`),
  clickbait: (t) => `${t} — And You Won't Believe #1`,
  seo: (t) => t,
}

/**
 * Chooses the template list for a request. Poem form, essay type and essay
 * grade replace the base list; tone is mixed in on top when a topic exists.
 */
function templatesFor(kind, { tone, poemType, essayType, essayGrade, hasTopic }) {
  let base = TITLE_TEMPLATES[kind] || TITLE_TEMPLATES.blog

  if (kind === 'poem' && poemType && poemType !== 'any' && POEM_TYPE_TEMPLATES[poemType]) {
    base = POEM_TYPE_TEMPLATES[poemType]
  }
  if (kind === 'essay') {
    if (essayGrade && ESSAY_GRADE_TEMPLATES[essayGrade]) base = ESSAY_GRADE_TEMPLATES[essayGrade]
    else if (essayType && essayType !== 'any' && ESSAY_TYPE_TEMPLATES[essayType]) base = ESSAY_TYPE_TEMPLATES[essayType]
  }

  // Tone templates all need a {topic}, so they only apply once one is typed.
  if (hasTopic && tone && tone !== 'standard' && TONE_TEMPLATES[tone]) {
    return [...TONE_TEMPLATES[tone], ...base.slice(0, 3)]
  }
  return base
}

/* Vowel letters are not vowel sounds: "a university", "an hour". */
const SOUNDS_LIKE_CONSONANT = /^(uni|use|user|usual|useful|euro|ubiqu|unan|unif|one|once)/i
const SOUNDS_LIKE_VOWEL = /^(hour|honest|honou?r|heir)/i

/**
 * Corrects "a"/"an" after a template has been filled in.
 *
 * Templates cannot know which word will land next to the article, so
 * "A {powerWord} Approach" comes out as "A Essential Approach" until this runs.
 */
function fixArticles(text) {
  return text.replace(/\b([Aa]n?)\s+([A-Za-z][\w'-]*)/g, (match, article, word) => {
    const startsWithVowelLetter = /^[aeiou]/i.test(word)
    const needsAn = SOUNDS_LIKE_VOWEL.test(word) || (startsWithVowelLetter && !SOUNDS_LIKE_CONSONANT.test(word))
    const corrected = needsAn ? 'an' : 'a'
    // Keep whatever capitalisation the template used.
    return (article[0] === 'A' ? corrected[0].toUpperCase() + corrected.slice(1) : corrected) + ' ' + word
  })
}

/**
 * A topic such as "save money" is an action, not a thing, so templates that
 * frame it as a possession ("Your {topic}") read badly. Those are skipped.
 */
const ACTION_STARTERS = new Set([
  'save', 'make', 'build', 'write', 'learn', 'start', 'grow', 'find', 'get', 'lose',
  'cook', 'draw', 'sell', 'buy', 'fix', 'clean', 'study', 'train', 'plan', 'read',
  'speak', 'teach', 'invest', 'earn', 'design', 'code', 'paint', 'run', 'become',
])

const looksLikeAction = (topic) => {
  const first = topic.trim().split(/\s+/)[0]?.toLowerCase() || ''
  // Gerunds are actions too — "cooking biryani", "learning guitar".
  return ACTION_STARTERS.has(first) || (first.endsWith('ing') && first.length > 5)
}

const POSSESSIVE_TEMPLATE = /\{topic\}\s*(Isn't|Fails)|Your \{topic\}/i

/**
 * Trims the framing people type around a topic.
 *
 * Templates supply their own framing, so a topic of "how to save money" would
 * otherwise produce "The Beginner's Guide to How to Save Money". Stripping the
 * lead-in leaves the subject itself, which every template can use.
 */
const TOPIC_LEAD_INS = /^(how to|how do i|how can i|ways to|tips for|guide to|a guide to|the best|best|about|why|what is|what are)\s+/i

function normaliseTopic(topic) {
  if (!topic) return ''
  const trimmed = topic.trim().replace(/[.?!]+$/, '')
  const stripped = trimmed.replace(TOPIC_LEAD_INS, '').trim()
  // Only accept the trim if something meaningful is left.
  return stripped.length >= 3 ? stripped : trimmed
}

/** Genre swaps the imagery pool so a thriller title cannot read like a romance. */
const bankFor = (genre) =>
  genre && genre !== 'any' && GENRE_BANKS[genre] ? { ...BANK, ...GENRE_BANKS[genre] } : BANK

/**
 * Generates titles for a topic. Templates that need a {topic} placeholder are
 * skipped when no topic is supplied, so poem/book titles still work standalone.
 */
export function generateTitles(kind, topic, options = {}) {
  const {
    count = 12,
    seed = 1,
    style = 'ap',
    keywords = '',
    tone = 'standard',
    genre = 'any',
    poemType = 'any',
    essayType = 'any',
    essayGrade = '',
  } = options

  const cleanTopic = topic.trim()
  const rng = createRng(`${kind}|${cleanTopic}|${seed}|${keywords}|${tone}|${genre}|${poemType}|${essayType}|${essayGrade}`)
  const keywordList = keywords.split(/[,\n]/).map((k) => k.trim()).filter(Boolean)

  const templates = templatesFor(kind, {
    tone,
    poemType,
    essayType,
    essayGrade,
    hasTopic: Boolean(cleanTopic),
  })
  const bank = bankFor(genre)

  const subject = normaliseTopic(cleanTopic)

  let usable = cleanTopic ? templates : templates.filter((t) => !t.includes('{topic}'))
  if (subject && looksLikeAction(subject)) {
    const fitting = usable.filter((t) => !POSSESSIVE_TEMPLATE.test(t))
    if (fitting.length >= 4) usable = fitting
  }
  const pool = usable.length ? usable : templates

  const results = new Set()
  // Two titles from one template differ only in a filled-in word, which reads
  // as a bug ("50 X Mistakes…" next to "30 X Mistakes…"). Templates are only
  // reused once every one of them has been tried.
  const usedTemplates = new Set()
  let guard = 0

  while (results.size < count && guard < count * 25) {
    guard += 1

    const fresh = pool.filter((t) => !usedTemplates.has(t))
    if (!fresh.length) usedTemplates.clear()
    const template = pick(rng, fresh.length ? fresh : pool)
    usedTemplates.add(template)

    const extras = {
      topic: subject || pick(rng, bank.noun),
      businessPrefix: pick(rng, NAME_BANKS.businessPrefix),
      businessSuffix: pick(rng, NAME_BANKS.businessSuffix),
    }
    if (keywordList.length && rng() < 0.5) extras.topic = pick(rng, keywordList)
    results.add(titled(fixArticles(fillTemplate(rng, template, bank, extras)), style))
  }

  return [...results].slice(0, count)
}

/* ------------------------------------------------------------------ */
/* Title rewriter                                                      */
/* ------------------------------------------------------------------ */

const SYNONYMS = {
  best: ['top', 'finest', 'strongest', 'leading'],
  guide: ['playbook', 'walkthrough', 'handbook', 'primer'],
  tips: ['tactics', 'techniques', 'ideas', 'pointers'],
  ways: ['methods', 'approaches', 'tactics', 'routes'],
  easy: ['simple', 'painless', 'straightforward', 'low-effort'],
  fast: ['quick', 'rapid', 'speedy', 'brisk'],
  improve: ['upgrade', 'sharpen', 'strengthen', 'refine'],
  make: ['build', 'create', 'craft', 'produce'],
  learn: ['master', 'pick up', 'get good at', 'study'],
  free: ['no-cost', 'zero-cost', 'complimentary'],
  mistakes: ['errors', 'missteps', 'blunders', 'traps'],
  beginners: ['newcomers', 'first-timers', 'starters'],
  ultimate: ['definitive', 'complete', 'no-nonsense'],
  amazing: ['remarkable', 'striking', 'standout'],
  need: ['require', 'want', 'must have'],
  start: ['begin', 'kick off', 'get going with'],
  write: ['draft', 'compose', 'put together'],
  increase: ['grow', 'lift', 'raise', 'boost'],
  reduce: ['cut', 'trim', 'lower', 'shrink'],
  important: ['essential', 'critical', 'central'],
  good: ['solid', 'strong', 'reliable', 'decent'],
  problem: ['issue', 'snag', 'obstacle', 'sticking point'],
  work: ['function', 'perform', 'deliver'],
  people: ['readers', 'teams', 'folks', 'users'],
  new: ['fresh', 'modern', 'updated', 'current'],
}

export const REWRITE_ANGLES = [
  { key: 'clear', label: 'Clearer', note: 'Trims filler and states the promise plainly.' },
  { key: 'seo', label: 'SEO-focused', note: 'Front-loads the keyword and keeps it under 60 characters.' },
  { key: 'question', label: 'Question', note: 'Turns the title into the question the reader is typing.' },
  { key: 'howto', label: 'How-to', note: 'Frames it as an actionable instruction.' },
  { key: 'listicle', label: 'Listicle', note: 'Adds a number, which reliably lifts click-through rate.' },
  { key: 'benefit', label: 'Benefit-led', note: 'Leads with the outcome instead of the topic.' },
  { key: 'curiosity', label: 'Curiosity', note: 'Opens an information gap without over-promising.' },
  { key: 'formal', label: 'Academic', note: 'Neutral register suitable for essays and journals.' },
  { key: 'short', label: 'Shortest', note: 'The tightest version that still makes sense.' },
]

const FILLER = ['very', 'really', 'just', 'actually', 'basically', 'that', 'some', 'quite', 'simply']

function stripFiller(title) {
  return title
    .split(/\s+/)
    .filter((w) => !FILLER.includes(w.toLowerCase().replace(/[^a-z]/g, '')))
    .join(' ')
}

function swapSynonyms(rng, title) {
  return title.replace(/[A-Za-z']+/g, (word) => {
    const key = word.toLowerCase()
    const options = SYNONYMS[key]
    if (!options || rng() < 0.45) return word
    const replacement = pick(rng, options)
    return word[0] === word[0].toUpperCase()
      ? replacement[0].toUpperCase() + replacement.slice(1)
      : replacement
  })
}

const coreSubject = (title) =>
  stripFiller(title)
    .replace(/^(how to|why|what|the|a|an)\s+/i, '')
    .replace(/[?.!:]+$/, '')
    .trim()

export function rewriteTitle(title, options = {}) {
  const { seed = 1, style = 'ap', keyword = '', angles = REWRITE_ANGLES.map((a) => a.key) } = options
  const clean = title.trim()
  if (!clean) return []

  const rng = createRng(`${clean}|${seed}|${keyword}`)
  const subject = coreSubject(clean)
  const kw = keyword.trim()

  const build = {
    clear: () => titled(swapSynonyms(rng, stripFiller(clean)), style),
    seo: () => {
      const base = kw ? `${kw}: ${subject}` : subject
      const withYear = base.length < 45 ? `${base} (${pick(rng, ['2026 Guide', 'Complete Guide', 'Step-by-Step'])})` : base
      return titled(withYear, style)
    },
    question: () => titled(`${pick(rng, ['How Do You', 'What Makes', 'Why Does', 'Should You'])} ${subject}?`, style),
    howto: () => titled(`How to ${subject.replace(/^(the|a|an)\s+/i, '')}`, style),
    listicle: () => titled(`${pick(rng, BANK.number)} ${pick(rng, ['Ways to', 'Rules for', 'Lessons on', 'Ideas for'])} ${subject}`, style),
    benefit: () => titled(`${subject} — ${pick(rng, BANK.benefit)}`, style),
    curiosity: () =>
      titled(`${pick(rng, ['What Nobody Tells You About', 'The Real Reason Behind', 'The Overlooked Side of'])} ${subject}`, style),
    formal: () =>
      titled(`${pick(rng, ['An Examination of', 'Rethinking', 'Perspectives on', 'A Critical Review of'])} ${subject}`, style),
    short: () => titled(swapSynonyms(rng, subject.split(/\s+/).slice(0, 5).join(' ')), style),
  }

  return angles
    .filter((key) => build[key])
    .map((key) => {
      const meta = REWRITE_ANGLES.find((a) => a.key === key)
      const value = build[key]()
      return { key, label: meta.label, note: meta.note, title: value, length: value.length }
    })
}

/* ------------------------------------------------------------------ */
/* Name generators                                                     */
/* ------------------------------------------------------------------ */

export const NAME_STYLES = [
  { key: 'human', label: 'Realistic' },
  { key: 'fantasy', label: 'Fantasy' },
  { key: 'scifi', label: 'Sci-fi' },
  { key: 'pokemon', label: 'Pokemon-style' },
  { key: 'pet', label: 'Pet' },
  { key: 'band', label: 'Band' },
  { key: 'business', label: 'Business' },
]

export const POKEMON_TYPE_NAMES = Object.keys(POKEMON_BANKS.roots)

/**
 * Names the parts can spell that are already taken.
 *
 * The roots are deliberately close to the real naming style, so a collision is
 * a matter of time — Char + mander is Charmander. The tool tells people the
 * names are theirs to use, so it must not hand them a trademark.
 */
const TAKEN_NAMES = new Set([
  'charmander', 'charizard', 'bulbasaur', 'vaporeon', 'jolteon', 'flareon',
  'glaceon', 'umbreon', 'espeon', 'leafeon', 'sylveon', 'onix', 'steelix',
  'magneton', 'magnemite', 'dragonite', 'gastly', 'aerodactyl', 'psyduck',
])

/**
 * Pokemon-style names, each with the type its name was built from.
 *
 * The type is not decoration: it picks the root the name is made of, so a Fire
 * result actually sounds like fire. Choosing "Any" picks a type per name rather
 * than dropping the connection.
 */
export function generatePokemon(options = {}) {
  const {
    count = 12,
    seed = 1,
    type = 'any',
    gender = 'any',
    fake = true,
  } = options

  const rng = createRng(`pokemon|${seed}|${type}|${gender}|${fake}`)
  const endings = (fake ? POKEMON_BANKS.ends : POKEMON_BANKS.realEnds)[gender] || POKEMON_BANKS.ends.any
  const types = type === 'any' ? POKEMON_TYPE_NAMES : [type]

  const seen = new Set()
  const out = []
  // Bounded rather than a while-true: a narrow type plus a narrow ending pool
  // can run out of unique combinations long before `count` is reached.
  for (let i = 0; i < count * 40 && out.length < count; i += 1) {
    const chosen = pick(rng, types)
    const roots = POKEMON_BANKS.roots[chosen] || POKEMON_BANKS.roots.Fire
    const name = pick(rng, fake ? roots.fake : roots.real) + pick(rng, endings)
    if (seen.has(name) || TAKEN_NAMES.has(name.toLowerCase())) continue
    seen.add(name)
    out.push({ name, type: chosen })
  }
  return out
}

export function generateNames(style, options = {}) {
  const { count = 12, seed = 1, gender = 'any', includeSurname = true, includeEpithet = false, startsWith = '' } = options
  const rng = createRng(`${style}|${seed}|${gender}|${startsWith}`)
  const out = new Set()
  let guard = 0

  const firstPool =
    gender === 'female' ? NAME_BANKS.humanFirstF
      : gender === 'male' ? NAME_BANKS.humanFirstM
        : gender === 'nonbinary' ? NAME_BANKS.humanFirstN
          : [...NAME_BANKS.humanFirstF, ...NAME_BANKS.humanFirstM, ...NAME_BANKS.humanFirstN]

  const make = () => {
    switch (style) {
      case 'fantasy': {
        const name = pick(rng, NAME_BANKS.fantasyFirst) + pick(rng, NAME_BANKS.fantasySuffix)
        const parts = [name]
        if (includeSurname) parts.push(pick(rng, NAME_BANKS.surname))
        if (includeEpithet) parts.push(pick(rng, NAME_BANKS.epithet))
        return parts.join(' ')
      }
      case 'scifi': {
        const name = pick(rng, NAME_BANKS.scifiFirst) + pick(rng, NAME_BANKS.scifiSuffix)
        return includeSurname ? `${name} ${pick(rng, NAME_BANKS.surname)}` : name
      }
      case 'pokemon':
        return pick(rng, NAME_BANKS.pokemonStart) + pick(rng, NAME_BANKS.pokemonEnd)
      case 'pet':
        return pick(rng, NAME_BANKS.petName)
      case 'band':
        return `${pick(rng, NAME_BANKS.bandAdjective)} ${pick(rng, NAME_BANKS.bandNoun)}`
      case 'business':
        return `${pick(rng, NAME_BANKS.businessPrefix)}${pick(rng, NAME_BANKS.businessSuffix)}`
      default: {
        const first = pick(rng, firstPool)
        const parts = [first]
        if (includeSurname) parts.push(pick(rng, NAME_BANKS.surname))
        if (includeEpithet) parts.push(pick(rng, NAME_BANKS.epithet))
        return parts.join(' ')
      }
    }
  }

  const letter = startsWith.trim().slice(0, 1).toLowerCase()
  while (out.size < count && guard < count * 40) {
    guard += 1
    const name = make()
    if (letter && name[0].toLowerCase() !== letter) continue
    out.add(name)
  }

  return [...out]
}

/* ------------------------------------------------------------------ */
/* Long-form generators                                                */
/* ------------------------------------------------------------------ */

export function generatePoem(options = {}) {
  const { seed = 1, stanzas = 3, theme = '', form = 'free' } = options
  const rng = createRng(`poem|${seed}|${theme}|${form}`)
  const extras = theme.trim() ? { abstract: theme.trim(), noun: theme.trim() } : {}

  if (form === 'haiku') {
    return [
      fillTemplate(rng, pick(rng, POEM_BANKS.opening), BANK, extras),
      fillTemplate(rng, pick(rng, POEM_BANKS.middle), BANK, extras),
      fillTemplate(rng, pick(rng, POEM_BANKS.closing), BANK, extras),
    ].join('\n')
  }

  const blocks = []
  for (let i = 0; i < stanzas; i += 1) {
    const lines = [
      fillTemplate(rng, pick(rng, POEM_BANKS.opening), BANK, extras),
      fillTemplate(rng, pick(rng, POEM_BANKS.middle), BANK, extras),
      fillTemplate(rng, pick(rng, POEM_BANKS.middle), BANK, extras),
      fillTemplate(rng, pick(rng, POEM_BANKS.closing), BANK, extras),
    ]
    blocks.push(lines.join('\n'))
  }
  return blocks.join('\n\n')
}

export function generateSong(options = {}) {
  const { seed = 1, theme = '', genre = 'indie' } = options
  const rng = createRng(`song|${seed}|${theme}|${genre}`)
  const extras = theme.trim() ? { noun: theme.trim(), abstract: theme.trim() } : {}
  const line = (bankKey) => fillTemplate(rng, pick(rng, SONG_BANKS[bankKey]), BANK, extras)

  const verse = () => [line('verse'), line('verse'), line('verse'), line('verse')].join('\n')
  const chorus = [line('chorus'), line('chorus'), line('chorus'), line('chorus')].join('\n')

  return [
    `[Verse 1]\n${verse()}`,
    `[Chorus]\n${chorus}`,
    `[Verse 2]\n${verse()}`,
    `[Chorus]\n${chorus}`,
    `[Bridge]\n${line('bridge')}\n${line('bridge')}`,
    `[Outro]\n${line('chorus')}`,
  ].join('\n\n')
}

export function generateBackstory(options = {}) {
  const { seed = 1, name = '', role = 'adventurer', length = 'medium' } = options
  const rng = createRng(`backstory|${seed}|${name}|${role}|${length}`)
  const who = name.trim() || generateNames('fantasy', { count: 1, seed })[0]

  const sentences = [
    `${who} was ${pick(rng, BACKSTORY_BANKS.origin)}.`,
    `Everything turned on ${pick(rng, BACKSTORY_BANKS.turningPoint)}.`,
    `As ${/^[aeiou]/i.test(role) ? 'an' : 'a'} ${role}, ${who} ${pick(rng, BACKSTORY_BANKS.skill)}.`,
    `The trouble is that ${who} ${pick(rng, BACKSTORY_BANKS.flaw)}.`,
    `What ${who} really wants is ${pick(rng, BACKSTORY_BANKS.want)}.`,
    `Nobody knows that ${pick(rng, BACKSTORY_BANKS.secret)}.`,
  ]

  const cut = length === 'short' ? 3 : length === 'long' ? 6 : 4
  const body = sentences.slice(0, cut).join(' ')

  return {
    name: who,
    text: body,
    beats: {
      origin: sentences[0],
      turningPoint: sentences[1],
      skill: sentences[2],
      flaw: sentences[3],
      want: sentences[4],
      secret: sentences[5],
    },
  }
}

export function generateSpeech(options = {}) {
  const { seed = 1, topic = '', occasion = 'a conference talk', minutes = 3 } = options
  const rng = createRng(`speech|${seed}|${topic}|${occasion}|${minutes}`)
  const subject = topic.trim() || 'the work that matters'
  const points = pickMany(rng, BANK.benefit, Math.max(2, Math.min(5, minutes)))

  // No "Point 1:" labels and no canned "here is a story" line: a speech is read
  // aloud, and scaffolding a speaker has to edit out first is worse than a
  // shorter paragraph. This is only the fallback — with a key the model writes
  // it — but a fallback still gets said in front of a room.
  const body = points
    .map((p, i) => {
      const lead = i === 0 ? 'Start with the simplest reason.' : pick(rng, SPEECH_BANKS.transition)
      return `${lead} ${subject} lets you ${p}. I have watched that change how a whole week goes.`
    })
    .join('\n\n')

  return [
    pick(rng, SPEECH_BANKS.hook),
    `I want to talk about ${subject}, and why it belongs at ${occasion}.`,
    body,
    pick(rng, SPEECH_BANKS.closer),
  ].join('\n\n')
}

export function generateFortune(options = {}) {
  const { seed = 1 } = options
  const rng = createRng(`fortune|${seed}`)
  return {
    fortune: pick(rng, FORTUNES),
    luckyNumbers: shuffle(rng, Array.from({ length: 60 }, (_, i) => i + 1)).slice(0, 6).sort((a, b) => a - b),
    lesson: pick(rng, LUCKY_MESSAGES),
  }
}

export function generatePrompts(options = {}) {
  const { seed = 1, count = 6, kind = 'text', subject = '' } = options
  const rng = createRng(`prompt|${seed}|${kind}|${subject}`)
  const out = []

  for (let i = 0; i < count; i += 1) {
    if (kind === 'image') {
      out.push(
        `${subject.trim() || pick(rng, BANK.noun)}, ${pick(rng, PROMPT_SUBJECTS)}, ${pick(rng, PROMPT_STYLES)}, ${pick(rng, PROMPT_LIGHTING)}, highly detailed, 4k`,
      )
    } else {
      const topic = subject.trim() || pick(rng, BANK.noun)
      out.push(
        `Act as ${pick(rng, PROMPT_ROLES)}. ${pick(rng, PROMPT_TASKS)} about ${topic}. ${pick(rng, PROMPT_CONSTRAINTS)} ${pick(rng, PROMPT_FORMATS)}`,
      )
    }
  }
  return out
}

// Exported so the prompt generator page can show the building blocks it uses.
export const PROMPT_ROLES = [
  'a senior copywriter', 'an experienced technical editor', 'a startup CFO',
  'a patient teacher', 'a skeptical peer reviewer', 'a conversion strategist',
  'a developer advocate', 'a documentary researcher', 'a UX writer',
]
export const PROMPT_TASKS = [
  'Write a 300-word explainer', 'Draft five headline options',
  'Produce a step-by-step checklist', 'Critique the common advice',
  'Outline a 1,000-word article', 'Summarise the trade-offs',
]
export const PROMPT_CONSTRAINTS = [
  'Keep it under 150 words.', 'Use short sentences and no jargon.',
  'Write at a grade-8 reading level.', 'Do not invent statistics.',
  'Give exactly three options.', 'Ask clarifying questions first.',
]
export const PROMPT_FORMATS = [
  'Return a numbered list.', 'Format as a markdown table.',
  'Reply in one paragraph.', 'Use headings and bullets.',
]
export const PROMPT_SUBJECTS = [
  'wide establishing shot', 'close-up portrait', 'aerial perspective',
  'shallow depth of field', 'symmetrical composition', 'low-angle view',
]
export const PROMPT_STYLES = [
  'cinematic 35mm photography', 'soft watercolour illustration',
  'flat vector illustration', 'moody oil painting', 'isometric 3D render',
  'high-contrast black and white film', 'risograph print texture',
]
export const PROMPT_LIGHTING = [
  'golden hour backlight', 'overcast diffused light', 'single warm lamp',
  'blue-hour ambient light', 'harsh midday sun', 'neon spill from a window',
]

/* ------------------------------------------------------------------ */
/* Lorem ipsum                                                         */
/* ------------------------------------------------------------------ */

export function generateLorem(options = {}) {
  const {
    unit = 'paragraphs',
    count = 3,
    startWithLorem = true,
    seed = 1,
    wordsPerSentence = [8, 18],
    sentencesPerParagraph = [3, 6],
    html = false,
  } = options
  const rng = createRng(`lorem|${seed}|${unit}|${count}`)

  const word = () => pick(rng, LOREM_WORDS)
  const sentence = () => {
    const n = randomInt(rng, wordsPerSentence[0], wordsPerSentence[1])
    const words = Array.from({ length: n }, word)
    const text = words.join(' ')
    return text[0].toUpperCase() + text.slice(1) + pick(rng, ['.', '.', '.', '.', '?', '!'])
  }
  const paragraph = () =>
    Array.from({ length: randomInt(rng, sentencesPerParagraph[0], sentencesPerParagraph[1]) }, sentence).join(' ')

  const LOREM_OPENER = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit']

  // Word mode has to keep the exact count, so the opener replaces the first
  // words in place rather than being substituted into the finished string.
  if (unit === 'words') {
    const words = Array.from({ length: count }, word)
    if (startWithLorem) {
      for (let i = 0; i < Math.min(LOREM_OPENER.length, count); i += 1) words[i] = LOREM_OPENER[i]
    }
    const text = words.join(' ')
    return html ? `<p>${text}</p>` : text
  }

  let blocks
  if (unit === 'sentences') {
    blocks = [Array.from({ length: count }, sentence).join(' ')]
  } else if (unit === 'lists') {
    blocks = Array.from({ length: count }, () => Array.from({ length: 5 }, () => sentence().replace(/[.?!]$/, '')))
  } else {
    blocks = Array.from({ length: count }, paragraph)
  }

  if (unit === 'lists') {
    return html
      ? blocks.map((items) => `<ul>\n${items.map((i) => `  <li>${i}</li>`).join('\n')}\n</ul>`).join('\n\n')
      : blocks.map((items) => items.map((i) => `• ${i}`).join('\n')).join('\n\n')
  }

  let text = blocks.join('\n\n')
  if (startWithLorem) {
    text = text.replace(/^[^.?!]*/, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit')
  }
  return html ? text.split('\n\n').map((p) => `<p>${p}</p>`).join('\n') : text
}

/* ------------------------------------------------------------------ */
/* Misc generators                                                     */
/* ------------------------------------------------------------------ */

export function randomStates(options = {}) {
  const { count = 1, seed = 1, region = 'all' } = options
  const rng = createRng(`state|${seed}|${region}|${count}`)
  const pool = region === 'all' ? US_STATES : US_STATES.filter((s) => s.region === region)
  return pickMany(rng, pool, Math.min(count, pool.length))
}

export function repeatText(text, options = {}) {
  const { times = 5, separator = '\n', numbered = false, reverse = false } = options
  if (!text) return ''
  const items = Array.from({ length: Math.max(0, times) }, (_, i) => (numbered ? `${i + 1}. ${text}` : text))
  return (reverse ? items.reverse() : items).join(separator === '\\n' ? '\n' : separator)
}

export const REGIONS = ['all', 'Northeast', 'Midwest', 'South', 'West']
