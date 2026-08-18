import { sentenceCaseLine, capitalizeTitle } from './capitalize.js'

/** Capitalize the first letter of every word, leaving the rest untouched. */
export const firstLetterCase = (text) =>
  text.replace(/(^|[\s"'([{\-–—/])([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase())

/** Capitalize the first letter of every word and lowercase the rest. */
export const properCase = (text) =>
  text.replace(/[A-Za-zÀ-ɏ']+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())

/** aLtErNaTiNg case, driven by letter position so spaces do not shift it. */
export function altCase(text, startUpper = false) {
  let i = 0
  return text.replace(/[A-Za-zÀ-ɏ]/g, (ch) => {
    const upper = startUpper ? i % 2 === 0 : i % 2 === 1
    i += 1
    return upper ? ch.toUpperCase() : ch.toLowerCase()
  })
}

/** Invert the case of every letter. */
export const toggleCase = (text) =>
  text.replace(/[A-Za-zÀ-ɏ]/g, (ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))

export const upperCase = (text) => text.toUpperCase()
export const lowerCase = (text) => text.toLowerCase()
export const sentenceCase = (text) => {
  // SHOUTED INPUT carries no case information, so acronym preservation has to
  // be switched off or nothing would change.
  const shouted = /[A-Z]{2,}/.test(text) && text === text.toUpperCase()
  const options = shouted ? { preserveAcronyms: false, preserveMixedCase: false } : {}
  return text
    .split(/(\r?\n)/)
    .map((chunk) => (/\r?\n/.test(chunk) ? chunk : sentenceCaseLine(chunk, options)))
    .join('')
}

export const inverseCase = (text) =>
  text.replace(/[A-Za-zÀ-ɏ']+/g, (w) => w[0].toLowerCase() + w.slice(1).toUpperCase())

/** Straight quotes and dashes → typographic ones. */
export function toCurlyQuotes(text) {
  return text
    .replace(/(^|[\s([{<—–-])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/(^|[\s([{<—–-])'/g, '$1‘')
    .replace(/'/g, '’')
    .replace(/(\w)--(\w)/g, '$1—$2')
    .replace(/\.\.\./g, '…')
}

/** Typographic quotes → plain ASCII. */
export function toStraightQuotes(text) {
  return text
    .replace(/[“”„‟″]/g, '"')
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
}

export const CASE_ACTIONS = [
  { key: 'title', label: 'Title Case', hint: 'Capitals on the important words, using the style guide you picked.' },
  { key: 'sentence', label: 'Sentence case', hint: 'Only the first word and names keep their capital.' },
  { key: 'upper', label: 'UPPERCASE', hint: 'Every letter becomes a capital.' },
  { key: 'lower', label: 'lowercase', hint: 'Every letter becomes small.' },
  { key: 'first', label: 'First Letter', hint: 'Capital on the first letter of each word. Rest stays as you typed it.' },
  { key: 'proper', label: 'Proper Case', hint: 'Capital on the first letter of each word, rest becomes small.' },
  { key: 'alt', label: 'aLt cAsE', hint: 'Small and capital letters, one after the other.' },
  { key: 'toggle', label: 'ToGgLe cAsE', hint: 'Flips the case of every letter you typed.' },
]

export function applyCaseAction(text, action, styleKey = 'apa', options = {}) {
  switch (action) {
    case 'title':
      return capitalizeTitle(text, styleKey, options)
    case 'sentence':
      return sentenceCase(text)
    case 'upper':
      return upperCase(text)
    case 'lower':
      return lowerCase(text)
    case 'first':
      return firstLetterCase(text)
    case 'proper':
      return properCase(text)
    case 'alt':
      return altCase(text)
    case 'toggle':
      return toggleCase(text)
    default:
      return text
  }
}

/* ------------------------------------------------------------------ */
/* Text statistics                                                     */
/* ------------------------------------------------------------------ */

export const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0)
export const countCharacters = (text) => text.length
export const countCharactersNoSpaces = (text) => text.replace(/\s/g, '').length
export const countSentences = (text) =>
  (text.match(/[^.!?]+[.!?]+(\s|$)/g) || (text.trim() ? [text] : [])).length
export const countParagraphs = (text) => text.split(/\n{2,}/).filter((p) => p.trim()).length
export const countSyllables = (word) => {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  if (w.length <= 3) return 1
  const groups = w
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '')
    .match(/[aeiouy]{1,2}/g)
  return groups ? groups.length : 1
}

export function textStats(text) {
  const words = text.trim() ? text.trim().split(/\s+/) : []
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const sentences = Math.max(countSentences(text), words.length ? 1 : 0)
  return {
    words: words.length,
    characters: countCharacters(text),
    charactersNoSpaces: countCharactersNoSpaces(text),
    sentences,
    paragraphs: countParagraphs(text),
    syllables,
    readingTimeSeconds: Math.round((words.length / 225) * 60),
    speakingTimeSeconds: Math.round((words.length / 130) * 60),
    longestWord: words.reduce((a, b) => (b.length > a.length ? b : a), ''),
    // Flesch reading ease, clamped to the familiar 0–100 band.
    readability: words.length
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(206.835 - 1.015 * (words.length / sentences) - 84.6 * (syllables / words.length)),
          ),
        )
      : 0,
  }
}

/* ------------------------------------------------------------------ */
/* Headline scoring — the "how good is this title" panel               */
/* ------------------------------------------------------------------ */

const POWER_WORDS = [
  'amazing', 'astonishing', 'authentic', 'backed', 'best', 'bold', 'brilliant',
  'complete', 'critical', 'definitive', 'effortless', 'essential', 'exclusive',
  'expert', 'extraordinary', 'fast', 'free', 'guaranteed', 'honest', 'huge',
  'incredible', 'instant', 'insider', 'new', 'perfect', 'powerful', 'practical',
  'proven', 'quick', 'rare', 'remarkable', 'secret', 'simple', 'smart',
  'stunning', 'surprising', 'ultimate', 'unbeatable', 'unexpected', 'urgent',
]

const EMOTIONAL_WORDS = [
  'afraid', 'angry', 'anxious', 'bad', 'beautiful', 'brave', 'confident',
  'confused', 'dangerous', 'delight', 'desperate', 'excited', 'fail', 'fear',
  'happy', 'hate', 'hope', 'hurt', 'joy', 'love', 'mistake', 'painful', 'proud',
  'regret', 'sad', 'safe', 'shocking', 'struggle', 'stupid', 'terrible',
  'thrilled', 'tired', 'trust', 'worry', 'wrong',
]

const COMMON_WORDS = [
  'a', 'about', 'all', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can',
  'do', 'for', 'from', 'get', 'has', 'have', 'how', 'i', 'if', 'in', 'is',
  'it', 'like', 'make', 'me', 'more', 'my', 'no', 'not', 'of', 'on', 'one',
  'or', 'our', 'out', 'so', 'that', 'the', 'their', 'them', 'they', 'this',
  'to', 'up', 'we', 'what', 'when', 'which', 'who', 'why', 'will', 'with',
  'you', 'your',
]

const UNCOMMON_BONUS_TYPES = ['how', 'why', 'what', 'when', 'who']

export function scoreHeadline(text) {
  const clean = text.trim()
  const words = clean ? clean.split(/\s+/) : []
  const lower = words.map((w) => w.toLowerCase().replace(/[^a-z']/g, '')).filter(Boolean)
  const chars = clean.length

  const power = lower.filter((w) => POWER_WORDS.includes(w))
  const emotional = lower.filter((w) => EMOTIONAL_WORDS.includes(w))
  const common = lower.filter((w) => COMMON_WORDS.includes(w))
  const uncommon = lower.filter((w) => !COMMON_WORDS.includes(w))
  const hasNumber = /\d/.test(clean)
  const questionType = UNCOMMON_BONUS_TYPES.find((t) => lower[0] === t)

  const checks = []
  const add = (ok, points, label, tip) => {
    checks.push({ ok, points, label, tip })
    return ok ? points : 0
  }

  let score = 0
  score += add(
    words.length >= 6 && words.length <= 13,
    20,
    `Word count: ${words.length}`,
    'Titles of 6 to 13 words get the most clicks and still read naturally.',
  )
  score += add(
    chars >= 40 && chars <= 60,
    18,
    `Character count: ${chars}`,
    'Google cuts titles at about 60 characters. Keep it between 40 and 60 so the full title shows.',
  )
  score += add(power.length > 0, 14, `Strong words: ${power.length}`, 'Add one strong word like "proven", "essential" or "complete".')
  score += add(emotional.length > 0, 12, `Feeling words: ${emotional.length}`, 'One feeling word helps the reader see why this matters to them.')
  score += add(hasNumber, 10, hasNumber ? 'Has a number' : 'No number', 'Titles with numbers, like "7 Ways…", get clicked more often.')
  score += add(
    !!questionType,
    8,
    questionType ? `Starts with "${questionType}"` : 'Does not start with How, Why or What',
    'Starting with How, Why or What tells the reader exactly what they will get.',
  )
  score += add(
    common.length / Math.max(words.length, 1) <= 0.5,
    10,
    `Common words: ${common.length} of ${words.length}`,
    'Keep everyday filler words under half the title, so it feels specific.',
  )
  score += add(
    uncommon.length >= 2,
    8,
    `Unusual words: ${uncommon.length}`,
    'Two or more unusual words make a title easier to remember.',
  )

  const grade = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Okay' : 'Needs work'

  return {
    score: Math.min(100, score),
    grade,
    words: words.length,
    characters: chars,
    powerWords: power,
    emotionalWords: emotional,
    commonWords: common,
    uncommonWords: uncommon,
    checks,
    // Roughly how the title renders in Google and on Twitter/X cards.
    truncatedInGoogle: chars > 60,
    truncatedInEmail: chars > 50,
  }
}
