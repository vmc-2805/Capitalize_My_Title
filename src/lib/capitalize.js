import {
  ACRONYM_MAP,
  AMBIGUOUS_ACRONYMS,
  ARTICLE_SET,
  BRAND_MAP,
  COORD_SET,
  NYT_SET,
  PREPOSITION_SET,
  PROPER_NOUN_SET,
} from './wordSets.js'

/**
 * Every style guide differs only in which short words it keeps lowercase and
 * how long a word may be before it must be capitalized. Encoding that as data
 * keeps one engine behind all nine tabs.
 */
export const STYLE_GUIDES = [
  {
    key: 'apa',
    label: 'APA',
    name: 'APA style (7th edition)',
    mode: 'title',
    // Words of four letters or more are always capitalized.
    maxLowercaseLength: 3,
    lowercase: ['articles', 'coordinating', 'prepositions'],
    lowercaseInfinitiveTo: false,
    capitalizeAfterColon: true,
    capitalizeHyphenSecond: true,
    summary:
      'Capital letters for the first word, the last word and all important words. Small letters for "a", "an", "the", joining words, and prepositions of three letters or fewer.',
    rules: [
      'Capitalize the first and last word of the title, and of the subtitle too.',
      'Capitalize every word of four letters or more, including "With" and "From".',
      'Keep "a", "an", "the", "and", "but", "or", "for", "nor" small, plus prepositions of three letters or fewer.',
      'Capitalize both halves of a joined word ("Self-Report", "Long-Term").',
      'Capitalize the first word after a colon or a dash.',
    ],
    usedFor: 'Psychology, education, nursing and most social science journals.',
  },
  {
    key: 'chicago',
    label: 'Chicago',
    name: 'Chicago Manual of Style (18th edition)',
    mode: 'title',
    // Chicago lowercases prepositions regardless of length.
    maxLowercaseLength: Infinity,
    lowercase: ['articles', 'coordinating', 'prepositions'],
    lowercaseInfinitiveTo: true,
    capitalizeAfterColon: true,
    capitalizeHyphenSecond: true,
    summary:
      'Capital letters for the first word, the last word and all important words. Every preposition stays small, however long it is, and so does "to" before a verb.',
    rules: [
      'Always capitalize the first and last word.',
      'Keep every preposition small, whatever its length — "between", "through" and "underneath" all stay small in the middle of a title.',
      'Keep "a", "an", "the" small, and also "and", "but", "for", "or", "nor".',
      'Keep "to" small when it comes before a verb ("How to Write"). Keep "as" small too.',
      'Capitalize the first word of the subtitle after a colon.',
    ],
    usedFor: 'Books, history, arts subjects and most publishing houses.',
  },
  {
    key: 'ap',
    label: 'AP',
    name: 'Associated Press style',
    mode: 'title',
    maxLowercaseLength: 3,
    lowercase: ['articles', 'coordinating', 'prepositions'],
    lowercaseInfinitiveTo: false,
    capitalizeAfterColon: true,
    capitalizeHyphenSecond: true,
    summary:
      'Capital letters for every word of four letters or more. Small words of three letters or fewer stay small, unless they come first or last.',
    rules: [
      'Capitalize the important words, including prepositions and joining words of four letters or more.',
      'Keep "a", "an", "the", "and", "at", "by", "for", "in", "of", "on", "to", "up" small in the middle.',
      'Always capitalize the first and last word, however short it is.',
      'Capitalize every verb, even short ones like "Is", "Are" and "Be".',
      'Capitalize the first word after a colon.',
    ],
    usedFor: 'News, headlines, press releases and marketing copy.',
  },
  {
    key: 'mla',
    label: 'MLA',
    name: 'MLA style (9th edition)',
    mode: 'title',
    maxLowercaseLength: Infinity,
    lowercase: ['articles', 'coordinating', 'prepositions'],
    lowercaseInfinitiveTo: true,
    capitalizeAfterColon: true,
    capitalizeHyphenSecond: true,
    summary:
      'Capital letters for the first word, the last word and every important word. Prepositions and joining words stay small, however long they are.',
    rules: [
      'Capitalize the first word, the last word and all important words.',
      'Keep "a", "an", "the", prepositions of any length, and joining words small.',
      'Keep "to" small when it comes before a verb.',
      'Capitalize words like "Because", "Although" and "If" — these are not joining words.',
      'Capitalize the first word of the subtitle after a colon.',
    ],
    usedFor: 'Literature, languages, culture studies and school or college essays.',
  },
  {
    key: 'bluebook',
    label: 'BB',
    name: 'Bluebook legal citation style',
    mode: 'title',
    // Bluebook lowercases short words of four letters or fewer.
    maxLowercaseLength: 4,
    lowercase: ['articles', 'coordinating', 'prepositions'],
    lowercaseInfinitiveTo: true,
    capitalizeAfterColon: true,
    capitalizeHyphenSecond: true,
    // Bluebook has no special rule for the final word of a title.
    capitalizeLastWord: false,
    summary:
      'Capital letters for every word, except small words of four letters or fewer. Those get a capital only if they come first or right after a colon.',
    rules: [
      'Capitalize the first word, and the first word after a colon.',
      'Keep words of four letters or fewer small — "with", "from" and "into" stay small.',
      'Capitalize prepositions of five letters or more ("Against", "Between", "Through").',
      'Keep "to" small when it comes before a verb.',
      'Keep short forms like "v." in small letters.',
    ],
    usedFor: 'Law journals, court papers and legal references.',
  },
  {
    key: 'ama',
    label: 'AMA',
    name: 'AMA Manual of Style (11th edition)',
    mode: 'title',
    maxLowercaseLength: 3,
    lowercase: ['articles', 'coordinating', 'prepositions'],
    lowercaseInfinitiveTo: false,
    capitalizeAfterColon: true,
    capitalizeHyphenSecond: true,
    summary:
      'Capital letters for the first word, the last word and all important words. Small words of three letters or fewer stay small, but short verbs always get a capital.',
    rules: [
      'Capitalize the first and last word of the title and the subtitle.',
      'Keep "a", "an", "the", short prepositions and joining words of three letters or fewer small.',
      'Always capitalize two-letter verbs like "Is", "Be", "Am" and "Do".',
      'Capitalize both halves of a joined word ("Follow-Up", "Cross-Sectional").',
      'Capitalize the first word after a colon or a dash.',
    ],
    usedFor: 'Medicine, medical research and clinical journals.',
  },
  {
    key: 'nyt',
    label: 'NYT',
    name: 'New York Times headline style',
    mode: 'title',
    maxLowercaseLength: 3,
    lowercase: ['nyt'],
    lowercaseInfinitiveTo: false,
    capitalizeAfterColon: true,
    capitalizeHyphenSecond: true,
    summary:
      'Capital letters for the important words. Only the words on the Times list stay small: a, and, as, at, but, by, en, for, if, in, of, on, or, the, to, v., vs., via.',
    rules: [
      'Capitalize the first and last word of the headline.',
      'Keep only the words on the Times list small. There is no length rule.',
      'Capitalize every preposition of four letters or more ("From", "With", "Into", "Over").',
      'Capitalize all verbs, including "Is" and "Be".',
      'Capitalize the first word after a colon or a dash.',
    ],
    usedFor: 'Newspaper headlines, editorials and news websites.',
  },
  {
    key: 'wikipedia',
    label: 'Wiki',
    name: 'Wikipedia title style',
    mode: 'title',
    // Wikipedia lowercases prepositions of four letters or fewer.
    maxLowercaseLength: 4,
    lowercase: ['articles', 'coordinating', 'prepositions'],
    lowercaseInfinitiveTo: true,
    capitalizeAfterColon: true,
    capitalizeHyphenSecond: true,
    summary:
      'Used when you list the title of a book or article on Wikipedia. Capital letters for the first word, the last word and all important words. Small words of four letters or fewer stay small.',
    rules: [
      'Capitalize the first and last word of the title.',
      'Keep "a", "an", "the" and joining words small.',
      'Keep prepositions of four letters or fewer small ("over", "with", "from", "into").',
      'Capitalize prepositions of five letters or more ("Against", "Between").',
      'Keep "to" small before a verb. Capitalize the word after a colon.',
    ],
    usedFor: 'Wikipedia references, wiki citations and reference lists.',
  },
  {
    key: 'email',
    label: 'Email',
    name: 'Email subject line style',
    mode: 'sentence',
    summary:
      'Sentence case: capital letter for the first word and for names only. It reads like a person talking, not an advertisement, and it works better in inboxes.',
    rules: [
      'Capitalize only the first word of the subject line.',
      'Keep names, brand names and short forms in capitals.',
      'Never use ALL CAPS. It is one of the strongest spam signals there is.',
      'Keep the line under about 50 characters, or phones will cut it short.',
      'Avoid exclamation marks at the end and words like "FREE" in capitals.',
    ],
    usedFor: 'Email subject lines, app notifications and short screen text.',
  },
]

export const STYLE_GUIDE_MAP = new Map(STYLE_GUIDES.map((g) => [g.key, g]))

// A "word" is letters/digits plus internal apostrophes, hyphens and slashes so
// compounds like "self-report" and "and/or" arrive as one token.
const WORD_RE = /[A-Za-zÀ-ɏ0-9]+(?:(?:['’\-/])[A-Za-zÀ-ɏ0-9]+)*/g

// Splits text into alternating word / non-word tokens so punctuation and
// whitespace survive the round trip untouched.
export function tokenize(text) {
  const tokens = []
  const re = new RegExp(WORD_RE.source, 'g')
  let lastIndex = 0
  let match
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'sep', value: text.slice(lastIndex, match.index) })
    }
    tokens.push({ type: 'word', value: match[0] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push({ type: 'sep', value: text.slice(lastIndex) })
  }
  return tokens
}

const hasInternalCapital = (word) => /^[a-z]*[A-Z]/.test(word.slice(1)) || /[a-z][A-Z]/.test(word)
const isAllCaps = (word) => word.length > 1 && word === word.toUpperCase() && /[A-Z]/.test(word)

function capitalizeWord(word) {
  if (!word) return word
  // Preserve a leading non-letter such as an opening quote inside the token.
  const idx = word.search(/[A-Za-zÀ-ɏ]/)
  if (idx === -1) return word
  return word.slice(0, idx) + word[idx].toUpperCase() + word.slice(idx + 1).toLowerCase()
}

function normalizeKnownWord(word) {
  const lower = word.toLowerCase()
  if (BRAND_MAP.has(lower)) return BRAND_MAP.get(lower)

  // "IT", "ID", "OK" and "TV" are also ordinary words, so they are only forced
  // into capitals when the writer typed them that way.
  const typedInCaps = word === word.toUpperCase()
  const allowed = (key) => !AMBIGUOUS_ACRONYMS.has(key) || typedInCaps

  if (ACRONYM_MAP.has(lower) && allowed(lower)) return ACRONYM_MAP.get(lower)
  const bare = lower.replace(/\.$/, '')
  if (ACRONYM_MAP.has(bare) && allowed(bare)) return ACRONYM_MAP.get(bare) + (lower.endsWith('.') ? '.' : '')
  return null
}

function buildLowercaseTester(guide, options) {
  const sets = []
  if (guide.lowercase?.includes('articles')) sets.push(ARTICLE_SET)
  if (guide.lowercase?.includes('coordinating')) sets.push(COORD_SET)
  if (guide.lowercase?.includes('prepositions')) sets.push(PREPOSITION_SET)
  if (guide.lowercase?.includes('nyt')) sets.push(NYT_SET)

  const custom = new Set((options.alwaysLowercase || []).map((w) => w.toLowerCase()))
  const maxLen = guide.maxLowercaseLength ?? 3

  return (rawWord) => {
    const word = rawWord.toLowerCase().replace(/[^a-z0-9'’]/g, '')
    if (custom.has(word)) return true

    // "to" before a verb is an infinitive marker in Chicago/MLA/Bluebook/Wiki.
    if (word === 'to' && guide.lowercaseInfinitiveTo) return true

    if (!sets.some((s) => s.has(word))) return false
    return word.replace(/[^a-z]/g, '').length <= maxLen
  }
}

/**
 * Applies a style guide to one line of text.
 */
function titleCaseLine(line, guide, options) {
  const tokens = tokenize(line)
  const wordIndexes = tokens.reduce((acc, t, i) => (t.type === 'word' ? [...acc, i] : acc), [])
  if (!wordIndexes.length) return line

  const firstWordIndex = wordIndexes[0]
  const lastWordIndex = wordIndexes[wordIndexes.length - 1]
  const shouldLowercase = buildLowercaseTester(guide, options)
  const alwaysUpper = new Set((options.alwaysUppercase || []).map((w) => w.toLowerCase()))
  const alwaysCapitalize = new Set((options.alwaysCapitalize || []).map((w) => w.toLowerCase()))

  let startOfClause = true

  return tokens
    .map((token, i) => {
      if (token.type === 'sep') {
        // A colon, em dash, question mark or opening bracket starts a new clause.
        if (/[:—–?!.]|\|/.test(token.value) && guide.capitalizeAfterColon !== false) {
          startOfClause = true
        }
        return token.value
      }

      const word = token.value
      const lower = word.toLowerCase()
      const isFirst = i === firstWordIndex
      const isLast = i === lastWordIndex
      const clauseStart = startOfClause
      startOfClause = false

      if (alwaysUpper.has(lower)) return word.toUpperCase()
      if (alwaysCapitalize.has(lower)) return capitalizeWord(word)

      const known = normalizeKnownWord(word)
      if (known) return known
      if (options.preserveAcronyms !== false && isAllCaps(word)) return word
      if (options.preserveMixedCase !== false && hasInternalCapital(word)) return word

      // Hyphenated and slashed compounds are cased segment by segment.
      if (/[-/]/.test(word)) {
        const parts = word.split(/([-/])/)
        let sawWord = false
        return parts
          .map((part) => {
            if (part === '-' || part === '/') return part
            if (!part) return part
            const partKnown = normalizeKnownWord(part)
            if (partKnown) return partKnown
            const first = !sawWord
            sawWord = true
            if (first && (isFirst || clauseStart)) return capitalizeWord(part)
            if (guide.capitalizeHyphenSecond === false) return part.toLowerCase()
            if (!first && shouldLowercase(part)) return part.toLowerCase()
            return capitalizeWord(part)
          })
          .join('')
      }

      if (isFirst || clauseStart) return capitalizeWord(word)
      if (isLast && guide.capitalizeLastWord !== false) return capitalizeWord(word)
      if (shouldLowercase(word)) return lower
      return capitalizeWord(word)
    })
    .join('')
}

/**
 * Sentence case: one capital at the start of each sentence, proper nouns kept.
 */
export function sentenceCaseLine(line, options = {}) {
  const tokens = tokenize(line)
  const custom = new Set((options.alwaysCapitalize || []).map((w) => w.toLowerCase()))
  const alwaysUpper = new Set((options.alwaysUppercase || []).map((w) => w.toLowerCase()))
  let startOfSentence = true
  let firstWordDone = false

  return tokens
    .map((token) => {
      if (token.type === 'sep') {
        if (/[.!?:]\s*$|[.!?:]\s/.test(token.value) || /\n/.test(token.value)) startOfSentence = true
        return token.value
      }
      const word = token.value
      const lower = word.toLowerCase()
      const atStart = startOfSentence
      startOfSentence = false

      if (alwaysUpper.has(lower)) return word.toUpperCase()

      const known = normalizeKnownWord(word)
      if (known) return known
      if (options.preserveAcronyms !== false && isAllCaps(word)) return word
      if (options.preserveMixedCase !== false && hasInternalCapital(word)) return word

      if (atStart && !firstWordDone) {
        firstWordDone = true
        return capitalizeWord(word)
      }
      if (atStart) return capitalizeWord(word)
      if (custom.has(lower)) return capitalizeWord(word)
      if (PROPER_NOUN_SET.has(lower.replace(/[^a-z']/g, ''))) return capitalizeWord(word)
      return lower
    })
    .join('')
}

/**
 * Main entry point — capitalizes multi-line text with the chosen style guide.
 */
export function capitalizeTitle(text, styleKey = 'apa', options = {}) {
  if (!text) return ''
  const guide = STYLE_GUIDE_MAP.get(styleKey) || STYLE_GUIDE_MAP.get('apa')

  // SHOUTED INPUT has no case information left to preserve, so acronym and
  // mixed-case protection is switched off — otherwise nothing would change.
  const shouted = /[A-Z]{2,}/.test(text) && text === text.toUpperCase()
  const opts = shouted ? { ...options, preserveAcronyms: false, preserveMixedCase: false } : options

  const apply = guide.mode === 'sentence'
    ? (line) => sentenceCaseLine(line, opts)
    : (line) => titleCaseLine(line, guide, opts)

  return text
    .split(/(\r?\n)/)
    .map((chunk) => (/\r?\n/.test(chunk) ? chunk : apply(chunk)))
    .join('')
}
