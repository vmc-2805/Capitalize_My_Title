/**
 * Unicode "font" styles. These are real code points, not fonts, which is why
 * the output survives copy-paste into Instagram bios, X posts and Discord.
 */

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'

// Builds a translation map from contiguous Unicode blocks.
function offsetStyle(upperStart, lowerStart, digitStart) {
  const map = {}
  for (let i = 0; i < 26; i += 1) {
    map[UPPER[i]] = String.fromCodePoint(upperStart + i)
    map[LOWER[i]] = String.fromCodePoint(lowerStart + i)
  }
  if (digitStart) {
    for (let i = 0; i < 10; i += 1) map[DIGITS[i]] = String.fromCodePoint(digitStart + i)
  }
  return map
}

function listStyle(upperChars, lowerChars, digitChars) {
  const map = {}
  const up = [...upperChars]
  const low = [...lowerChars]
  for (let i = 0; i < 26; i += 1) {
    if (up[i]) map[UPPER[i]] = up[i]
    if (low[i]) map[LOWER[i]] = low[i]
  }
  if (digitChars) {
    const dg = [...digitChars]
    for (let i = 0; i < 10; i += 1) if (dg[i]) map[DIGITS[i]] = dg[i]
  }
  return map
}

const MATH_BOLD = offsetStyle(0x1d400, 0x1d41a, 0x1d7ce)
const MATH_ITALIC = offsetStyle(0x1d434, 0x1d44e)
const MATH_BOLD_ITALIC = offsetStyle(0x1d468, 0x1d482)
const SANS_BOLD = offsetStyle(0x1d5d4, 0x1d5ee, 0x1d7ec)
const SANS_ITALIC = offsetStyle(0x1d608, 0x1d622)
const SANS_BOLD_ITALIC = offsetStyle(0x1d63c, 0x1d656)
const MONOSPACE = offsetStyle(0x1d670, 0x1d68a, 0x1d7f6)
const DOUBLE_STRUCK = offsetStyle(0x1d538, 0x1d552, 0x1d7d8)
const FRAKTUR = offsetStyle(0x1d504, 0x1d51e)
const FRAKTUR_BOLD = offsetStyle(0x1d56c, 0x1d586)
const SCRIPT = offsetStyle(0x1d49c, 0x1d4b6)
const SCRIPT_BOLD = offsetStyle(0x1d4d0, 0x1d4ea)

// Some blocks have holes, so the affected letters are patched individually.
Object.assign(MATH_ITALIC, { h: 'ℎ' })
Object.assign(FRAKTUR, { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' })
Object.assign(SCRIPT, { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' })
Object.assign(DOUBLE_STRUCK, { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' })

const CIRCLED = listStyle(
  'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
  'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ',
  '⓿①②③④⑤⑥⑦⑧⑨',
)

const CIRCLED_NEGATIVE = listStyle(
  '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩',
  '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩',
  '⓿❶❷❸❹❺❻❼❽❾',
)

const SQUARED = listStyle(
  '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉',
  '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉',
)

const SQUARED_NEGATIVE = listStyle(
  '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉',
  '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉',
)

const FULLWIDTH = offsetStyle(0xff21, 0xff41, 0xff10)

const SMALL_CAPS = listStyle(
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘQʀsᴛᴜᴠᴡxʏᴢ',
)

const SUPERSCRIPT = listStyle(
  'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁⱽᵂˣʸᶻ',
  'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ',
  '⁰¹²³⁴⁵⁶⁷⁸⁹',
)

const SUBSCRIPT = listStyle(
  'ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz',
  'ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz',
  '₀₁₂₃₄₅₆₇₈₉',
)

const UPSIDE_DOWN = listStyle(
  '∀ᙠƆᗡƎℲƏHIſʞ˥WNOԀQᴚSꞱՈΛMXʎZ',
  'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz',
  '0ƖᄅƐㄣϛ9ㄥ86',
)

// Wingdings is a symbol font; the closest faithful mapping is the Unicode
// equivalents of each glyph in the original character set.
const WINGDINGS = listStyle(
  '✌🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🙰🙵●❍■□◻❑❒⬧⧫◆❖',
  '✏✂✁👓🕭🕮🕯🕿✆🖁🖂🖃🖄🖅🖆🖇🖈🖉✇✍👌👍👎☜☞☝',
  '0①②③④⑤⑥⑦⑧⑨',
)

const WEBDINGS = listStyle(
  '🕷🕸🕲🕶🏆🎗🏵🏶🎖🎔🎕🎘🎜🎝🗕🗖🗗🗘🗙🗚🗛🗜🗝🗞🗟🗠',
  '🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🌍🌎🌏🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦',
)

/* ------------------------------------------------------------------ */
/* Decorative look-alike alphabets                                     */
/*                                                                     */
/* Written as 26-element arrays rather than one long string so each     */
/* letter is auditable and a missing glyph cannot shift the whole map.  */
/* ------------------------------------------------------------------ */

const ANCIENT_LETTERS = [
  'ᚨ', 'ᛒ', 'ᚲ', 'ᛞ', 'ᛖ', 'ᚠ', 'ᚷ',
  'ᚺ', 'ᛁ', 'ᛃ', 'ᚴ', 'ᛚ', 'ᛗ', 'ᚾ',
  'ᛟ', 'ᛈ', 'ᛩ', 'ᚱ', 'ᛊ', 'ᛏ', 'ᚢ',
  'ᚡ', 'ᚹ', 'ᛪ', 'ᛦ', 'ᛎ',
]

const ASIAN_LETTERS = [
  '卂', '乃', '匚', '刀', '乇', '千', '厶',
  '卄', '丨', '丁', '长', '乚', '从', '𠘨',
  '口', '卩', '㔿', '尺', '丂', '丅', '凵',
  'ᐯ', '山', '乂', '丫', '乙',
]

const TRIBAL_LETTERS = [
  'ል', 'ጌ', 'ር', 'ዕ', 'ቿ', 'ቻ', 'ኗ',
  'ዘ', 'ጎ', 'ጋ', 'ጕ', 'ረ', 'ጠ', 'ክ',
  'ዐ', 'የ', 'ዒ', 'ዪ', 'ነ', 'ፕ', 'ሁ',
  'ሀ', 'ሠ', 'ሸ', 'ሃ', 'ጊ',
]

const SQUIGGLE_ONE_LETTERS = [
  'ǟ', 'ɮ', 'ƈ', 'ɖ', 'ɛ', 'ʄ', 'ɢ',
  'ɦ', 'ɨ', 'ʝ', 'ӄ', 'ʟ', 'ʍ', 'ռ',
  'օ', 'ք', 'զ', 'ʀ', 'ֆ', 'ȶ', 'ʊ',
  'ʋ', 'ա', 'χ', 'ʏ', 'ʐ',
]

const SQUIGGLE_TWO_LETTERS = [
  'ค', '๒', 'ς', '๔', 'є', 'Ŧ', 'ﻮ',
  'ђ', 'เ', 'ן', 'к', 'l', '๓', 'ภ',
  '๏', 'ק', 'ợ', 'г', 'ร', 't', 'ย',
  'ש', 'ฬ', 'א', 'ץ', 'չ',
]

const CRAZY_ONE_LETTERS = [
  'ᗩ', 'ᗷ', 'ᑕ', 'ᗪ', 'ᗴ', 'ᖴ', 'ᘜ',
  'ᕼ', 'ᓰ', 'ᒍ', 'ᛕ', 'ᒪ', 'ᗰ', 'ᑎ',
  'O', 'ᑭ', 'ᑫ', 'ᖇ', 'ᔕ', 'ㄒ', 'ᑌ',
  'ᐯ', 'ᗯ', '᙭', 'ᖻ', 'ᙆ',
]

const CRAZY_TWO_LETTERS = [
  'Å', 'β', 'Ç', 'Ð', 'Ê', 'Ƒ', 'Ġ',
  'Ĥ', 'Ï', 'Ĵ', 'Ҝ', 'Ł', 'Μ', 'Ñ',
  'Ø', 'Þ', 'Q', 'Ř', 'Ŝ', 'Ŧ', 'Ú',
  'V', 'Ŵ', 'Ж', 'Ý', 'Ž',
]

const ANCIENT = listStyle(ANCIENT_LETTERS, ANCIENT_LETTERS)
const ASIAN_LIKE = listStyle(ASIAN_LETTERS, ASIAN_LETTERS)
const TRIBAL_LIKE = listStyle(TRIBAL_LETTERS, TRIBAL_LETTERS)
const SQUIGGLE_ONE = listStyle(SQUIGGLE_ONE_LETTERS, SQUIGGLE_ONE_LETTERS)
const SQUIGGLE_TWO = listStyle(SQUIGGLE_TWO_LETTERS, SQUIGGLE_TWO_LETTERS)
const CRAZY_ONE = listStyle(CRAZY_ONE_LETTERS, CRAZY_ONE_LETTERS)
const CRAZY_TWO = listStyle(CRAZY_TWO_LETTERS, CRAZY_TWO_LETTERS)

export const UNICODE_STYLES = [
  { key: 'bold', label: 'Bold', sample: '𝐁𝐨𝐥𝐝', map: MATH_BOLD, group: 'Bold & italic' },
  { key: 'sansBold', label: 'Bold (sans-serif)', sample: '𝗕𝗼𝗹𝗱', map: SANS_BOLD, group: 'Bold & italic' },
  { key: 'italic', label: 'Italic', sample: '𝐼𝑡𝑎𝑙𝑖𝑐', map: MATH_ITALIC, group: 'Bold & italic' },
  { key: 'sansItalic', label: 'Italic (sans-serif)', sample: '𝘐𝘵𝘢𝘭𝘪𝘤', map: SANS_ITALIC, group: 'Bold & italic' },
  { key: 'boldItalic', label: 'Bold italic', sample: '𝑩𝒐𝒍𝒅', map: MATH_BOLD_ITALIC, group: 'Bold & italic' },
  { key: 'sansBoldItalic', label: 'Bold italic (sans)', sample: '𝘽𝙤𝙡𝙙', map: SANS_BOLD_ITALIC, group: 'Bold & italic' },
  { key: 'script', label: 'Script', sample: '𝒮𝒸𝓇𝒾𝓅𝓉', map: SCRIPT, group: 'Decorative' },
  { key: 'scriptBold', label: 'Bold script', sample: '𝓑𝓸𝓵𝓭', map: SCRIPT_BOLD, group: 'Decorative' },
  { key: 'fraktur', label: 'Fraktur', sample: '𝔉𝔯𝔞𝔨', map: FRAKTUR, group: 'Decorative' },
  { key: 'frakturBold', label: 'Bold fraktur', sample: '𝕱𝖗𝖆𝖐', map: FRAKTUR_BOLD, group: 'Decorative' },
  { key: 'doubleStruck', label: 'Double-struck', sample: '𝔻𝕠𝕦𝕓𝕝𝕖', map: DOUBLE_STRUCK, group: 'Decorative' },
  { key: 'monospace', label: 'Monospace', sample: '𝙼𝚘𝚗𝚘', map: MONOSPACE, group: 'Technical' },
  { key: 'fullwidth', label: 'Fullwidth (vaporwave)', sample: 'Ｗｉｄｅ', map: FULLWIDTH, group: 'Technical' },
  { key: 'smallCaps', label: 'Small caps', sample: 'sᴍᴀʟʟ', map: SMALL_CAPS, group: 'Technical' },
  { key: 'superscript', label: 'Superscript', sample: 'ˢᵘᵖᵉʳ', map: SUPERSCRIPT, group: 'Technical' },
  { key: 'subscript', label: 'Subscript', sample: 'ₛᵤb', map: SUBSCRIPT, group: 'Technical' },
  { key: 'circled', label: 'Bubble', sample: 'ⓑⓤⓑⓑⓛⓔ', map: CIRCLED, group: 'Bubble & square' },
  { key: 'circledNegative', label: 'Black bubble', sample: '🅑🅤🅑', map: CIRCLED_NEGATIVE, group: 'Bubble & square' },
  { key: 'squared', label: 'Square', sample: '🄲🄰🅂🄴', map: SQUARED, group: 'Bubble & square' },
  { key: 'squaredNegative', label: 'Black square', sample: '🅲🅰🆂🅴', map: SQUARED_NEGATIVE, group: 'Bubble & square' },
  { key: 'upsideDown', label: 'Upside down', sample: 'ʌbsıpǝ', map: UPSIDE_DOWN, group: 'Fun', reverse: true },
  { key: 'wingdings', label: 'Wingdings', sample: '✏✂✁', map: WINGDINGS, group: 'Symbol fonts' },
  { key: 'webdings', label: 'Webdings', sample: '🕷🕸', map: WEBDINGS, group: 'Symbol fonts' },
  { key: 'ancient', label: 'Ancient', sample: 'ᚨᚾᚲᛁᛖᚾᛏ', map: ANCIENT, group: 'Look-alike alphabets' },
  { key: 'asianLike', label: 'Asian-like', sample: '卂丂丨卂几', map: ASIAN_LIKE, group: 'Look-alike alphabets' },
  { key: 'tribalLike', label: 'Tribal-like', sample: 'ፕዪጎጌልረ', map: TRIBAL_LIKE, group: 'Look-alike alphabets' },
  { key: 'squiggle1', label: 'Squiggle 1', sample: 'ֆզʊɨɢɢʟɛ', map: SQUIGGLE_ONE, group: 'Look-alike alphabets' },
  { key: 'squiggle2', label: 'Squiggle 2', sample: 'รợยเﻮﻮlє', map: SQUIGGLE_TWO, group: 'Look-alike alphabets' },
  { key: 'crazy1', label: 'Crazy 1', sample: 'ᑕᖇᗩᘔY', map: CRAZY_ONE, group: 'Look-alike alphabets' },
  { key: 'crazy2', label: 'Crazy 2', sample: 'ÇŘÅŽÝ', map: CRAZY_TWO, group: 'Look-alike alphabets' },
]

export const STYLE_BY_KEY = new Map(UNICODE_STYLES.map((s) => [s.key, s]))

export function toUnicodeStyle(text, styleKey) {
  const style = STYLE_BY_KEY.get(styleKey)
  if (!style) return text
  const mapped = [...text].map((ch) => style.map[ch] ?? ch)
  return (style.reverse ? mapped.reverse() : mapped).join('')
}

/* Combining-mark decorations — strikethrough, underline and "zalgo". */
export const COMBINING = [
  { key: 'strikethrough', label: 'Strikethrough', mark: '̶', sample: 's̶t̶r̶i̶k̶e̶' },
  { key: 'underline', label: 'Underline', mark: '̲', sample: 'u̲n̲d̲e̲r̲' },
  { key: 'overline', label: 'Overline', mark: '̅', sample: 'o̅v̅e̅r̅' },
  { key: 'slash', label: 'Slashed', mark: '̸', sample: 's̸l̸a̸s̸h̸' },
]

export const applyCombining = (text, mark) => [...text].map((ch) => (ch === '\n' ? ch : ch + mark)).join('')

/* ------------------------------------------------------------------ */
/* Decorator styles                                                    */
/*                                                                     */
/* These transform the text rather than substituting letters, so they   */
/* are functions instead of maps.                                       */
/* ------------------------------------------------------------------ */

const isPlain = (ch) => ch === ' ' || ch === '\n' || ch === '\t'

/** Applies a per-character transform, leaving whitespace untouched. */
const perCharacter = (fn) => (text) => [...text].map((ch) => (isPlain(ch) ? ch : fn(ch))).join('')

/** Wraps every character in a pair of brackets. */
const wrapEach = (open, close) => perCharacter((ch) => `${open}${ch}${close}`)

// A fixed set of combining marks, cycled by position so the same input always
// produces the same output — random zalgo cannot be copied or reproduced.
const ZALGO_ABOVE = ['̍', '͐', '͗', '̀', '́', '̆', '̐', '̽']
const ZALGO_MIDDLE = ['̴', '̵', '̶', '̸']
const ZALGO_BELOW = ['̖', '̗', '̘', '̥', '̮', 'ͅ', '͈', '͎']

const cursed = (text) =>
  [...text]
    .map((ch, i) => {
      if (isPlain(ch)) return ch
      return (
        ch +
        ZALGO_ABOVE[i % ZALGO_ABOVE.length] +
        ZALGO_ABOVE[(i * 3 + 5) % ZALGO_ABOVE.length] +
        ZALGO_MIDDLE[i % ZALGO_MIDDLE.length] +
        ZALGO_BELOW[i % ZALGO_BELOW.length] +
        ZALGO_BELOW[(i * 5 + 2) % ZALGO_BELOW.length]
      )
    })
    .join('')

// Regional indicators combine into flags when adjacent, so a zero-width space
// is inserted between them to keep each letter separate.
const REGIONAL_BASE = 0x1f1e6
const emojiLetters = (text) =>
  [...text]
    .map((ch) => {
      const code = ch.toLowerCase().charCodeAt(0)
      if (code < 97 || code > 122) return ch
      return String.fromCodePoint(REGIONAL_BASE + code - 97)
    })
    .join('​')

export const TEXT_DECORATORS = [
  { key: 'strikethrough', label: 'Strikethrough', group: 'Lines', render: (t) => applyCombining(t, '̶') },
  { key: 'underline', label: 'Underlined', group: 'Lines', render: (t) => applyCombining(t, '̲') },
  { key: 'doubleUnderline', label: 'Double underlined', group: 'Lines', render: (t) => applyCombining(t, '̳') },
  { key: 'overline', label: 'Overlined', group: 'Lines', render: (t) => applyCombining(t, '̅') },
  { key: 'slash', label: 'Slashed', group: 'Lines', render: (t) => applyCombining(t, '̸') },
  { key: 'backwards', label: 'Backwards', group: 'Fun', render: (t) => [...t].reverse().join('') },
  { key: 'cursed', label: 'Cursed', group: 'Fun', render: cursed },
  { key: 'emoji', label: 'Emoji', group: 'Fun', render: emojiLetters },
  { key: 'fireworks', label: 'Fireworks', group: 'Fun', render: (t) => applyCombining(t, '҉') },
  { key: 'stinky', label: 'Stinky', group: 'Fun', render: (t) => applyCombining(t, '͙') },
  { key: 'seagull', label: 'Seagull', group: 'Fun', render: (t) => applyCombining(t, '̼') },
  { key: 'frame', label: 'Frame', group: 'Wrapped', render: (t) => applyCombining(t, '⃞') },
  { key: 'bracket', label: 'Bracket', group: 'Wrapped', render: wrapEach('〔', '〕') },
  { key: 'darkBracket', label: 'Dark bracket', group: 'Wrapped', render: wrapEach('【', '】') },
  { key: 'musical', label: 'Musical', group: 'Wrapped', render: (t) => [...t].map((ch) => (isPlain(ch) ? ch : `${ch}♪`)).join('') },
]

export const DECORATOR_BY_KEY = new Map(TEXT_DECORATORS.map((d) => [d.key, d]))

/**
 * Every style the fancy-text gallery offers, in display order, with a uniform
 * `render(text)` interface so map styles and decorators can sit side by side.
 */
export const ALL_TEXT_STYLES = (() => {
  const fromMap = (key, label) => {
    const style = STYLE_BY_KEY.get(key)
    return { key, label: label || style.label, group: style.group, render: (t) => toUnicodeStyle(t, key) }
  }
  const fromDecorator = (key, label) => {
    const d = DECORATOR_BY_KEY.get(key)
    return { key, label: label || d.label, group: d.group, render: d.render }
  }

  return [
    fromMap('wingdings', 'Wingdings'),
    fromMap('webdings', 'Webdings'),
    fromMap('superscript', 'Small text'),
    fromMap('smallCaps', 'Small caps'),
    fromMap('circled', 'Bubble text'),
    fromDecorator('cursed', 'Cursed'),
    fromMap('fraktur', 'Gothic'),
    fromMap('frakturBold', 'Bold gothic'),
    fromMap('circledNegative', 'Black bubble'),
    fromMap('doubleStruck', 'Double struck'),
    fromMap('monospace', 'Mono'),
    fromMap('script', 'Cursive text'),
    fromMap('scriptBold', 'Bold cursive'),
    fromDecorator('strikethrough', 'Strikethrough'),
    fromMap('upsideDown', 'Upside down'),
    fromMap('bold', 'Bold'),
    fromDecorator('backwards', 'Backwards'),
    fromDecorator('underline', 'Underlined'),
    fromDecorator('doubleUnderline', 'Double underlined'),
    fromMap('italic', 'Italics'),
    fromMap('boldItalic', 'Bold italics (serif)'),
    fromMap('sansBoldItalic', 'Bold italics (sans serif)'),
    fromDecorator('emoji', 'Emoji'),
    fromMap('fullwidth', 'Vaporwave'),
    fromMap('squared', 'Square'),
    fromMap('squaredNegative', 'Black square'),
    fromMap('squiggle1', 'Squiggle 1'),
    fromMap('squiggle2', 'Squiggle 2'),
    fromMap('crazy1', 'Crazy 1'),
    fromMap('crazy2', 'Crazy 2'),
    fromMap('ancient', 'Ancient'),
    fromDecorator('fireworks', 'Fireworks'),
    fromDecorator('stinky', 'Stinky'),
    fromDecorator('seagull', 'Seagull'),
    fromDecorator('frame', 'Frame'),
    fromDecorator('bracket', 'Bracket'),
    fromDecorator('darkBracket', 'Dark bracket'),
    fromDecorator('musical', 'Musical'),
    fromMap('asianLike', 'Asian-like'),
    fromMap('tribalLike', 'Tribal-like'),
    fromMap('sansBold', 'Bold (sans serif)'),
    fromMap('sansItalic', 'Italics (sans serif)'),
    fromMap('subscript', 'Subscript'),
    fromDecorator('overline', 'Overlined'),
    fromDecorator('slash', 'Slashed'),
  ]
})()

/* Invisible / empty characters, with names so users know what they copied. */
export const INVISIBLE_CHARACTERS = [
  { name: 'Hangul filler', char: 'ㅤ', code: 'U+3164', note: 'Widest support — works in most usernames and bios.' },
  { name: 'Zero width space', char: '​', code: 'U+200B', note: 'Zero width. Often stripped by trimming.' },
  { name: 'Zero width non-joiner', char: '‌', code: 'U+200C', note: 'Zero width, used to break ligatures.' },
  { name: 'Zero width joiner', char: '‍', code: 'U+200D', note: 'Zero width, joins emoji sequences.' },
  { name: 'Braille blank', char: '⠀', code: 'U+2800', note: 'Renders as a blank braille cell.' },
  { name: 'Hair space', char: ' ', code: 'U+200A', note: 'The narrowest visible space.' },
  { name: 'Thin space', char: ' ', code: 'U+2009', note: 'Slightly wider than a hair space.' },
  { name: 'En space', char: ' ', code: 'U+2002', note: 'Half an em wide.' },
  { name: 'Em space', char: ' ', code: 'U+2003', note: 'One em wide.' },
  { name: 'Ideographic space', char: '　', code: 'U+3000', note: 'Full-width space used in CJK text.' },
  { name: 'Non-breaking space', char: ' ', code: 'U+00A0', note: 'Prevents a line break at that point.' },
  { name: 'Word joiner', char: '⁠', code: 'U+2060', note: 'Zero width and never breaks a line.' },
]
