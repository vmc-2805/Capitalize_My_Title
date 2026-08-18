/**
 * Logic tests for the pure libraries behind every tool. Run with `npm test`.
 * These cover the parts where a silent wrong answer would be worst: style
 * guide capitalization, CSV/JSON round trips and the word-game solvers.
 */

import assert from 'node:assert/strict'

const { capitalizeTitle, STYLE_GUIDES } = await import('../src/lib/capitalize.js')
const textCase = await import('../src/lib/textCase.js')
const convert = await import('../src/lib/convert.js')
const formats = await import('../src/lib/dataFormats.js')
const generators = await import('../src/lib/generators.js')
const titleOptions = await import('../src/lib/titleOptions.js')
const unicode = await import('../src/lib/unicode.js')
const nav = await import('../src/data/navigation.js')
const posts = await import('../src/data/posts.js')

let passed = 0
let failed = 0
const group = (name) => console.log(`\n${name}`)

function check(label, fn) {
  try {
    fn()
    passed += 1
    console.log(`  ok   ${label}`)
  } catch (error) {
    failed += 1
    console.log(`  FAIL ${label}\n       ${error.message.split('\n')[0]}`)
  }
}

/* ------------------------------------------------------------------ */
group('Title capitalization — style guides')

check('APA capitalizes prepositions of four letters or more', () => {
  assert.equal(capitalizeTitle('a guide to writing between the lines', 'apa'), 'A Guide to Writing Between the Lines')
})

check('Chicago lowercases prepositions of any length', () => {
  assert.equal(capitalizeTitle('a guide to writing between the lines', 'chicago'), 'A Guide to Writing between the Lines')
})

check('AP capitalizes words of four letters or more', () => {
  assert.equal(capitalizeTitle('the rise and fall of the house of usher', 'ap'), 'The Rise and Fall of the House of Usher')
})

check('MLA lowercases the infinitive "to"', () => {
  assert.equal(capitalizeTitle('how to win friends', 'mla'), 'How to Win Friends')
})

check('Bluebook lowercases short prepositions but not long ones', () => {
  assert.equal(capitalizeTitle('a study of rights against the state', 'bluebook'), 'A Study of Rights Against the State')
})

check('Every guide capitalizes the first word after a colon', () => {
  for (const guide of STYLE_GUIDES.filter((g) => g.mode !== 'sentence')) {
    const out = capitalizeTitle('editing: a field guide', guide.key)
    assert.ok(out.includes(': A Field Guide'), `${guide.key} produced "${out}"`)
  }
})

check('First and last words are always capitalized', () => {
  assert.equal(capitalizeTitle('the man in the room with a', 'apa'), 'The Man in the Room With A')
})

check('Acronyms survive title case', () => {
  assert.equal(capitalizeTitle('how NASA uses HTML and CSS', 'ap'), 'How NASA Uses HTML and CSS')
})

check('Brand casing survives title case', () => {
  assert.equal(capitalizeTitle('the iphone and the ipad', 'ap'), 'The iPhone and the iPad')
})

check('ALL CAPS input is converted rather than preserved', () => {
  assert.equal(capitalizeTitle('THE QUICK BROWN FOX', 'ap'), 'The Quick Brown Fox')
})

check('Hyphenated compounds capitalize both meaningful parts', () => {
  assert.equal(capitalizeTitle('a self-report study', 'apa'), 'A Self-Report Study')
})

check('Multiple lines are converted independently', () => {
  assert.equal(capitalizeTitle('first title here\nsecond title here', 'ap'), 'First Title Here\nSecond Title Here')
})

check('Email style produces sentence case with proper nouns intact', () => {
  assert.equal(capitalizeTitle('your monday report from NASA is ready', 'email'), 'Your Monday report from NASA is ready')
})

check('Custom always-lowercase words are respected', () => {
  const out = capitalizeTitle('the ludwig von beethoven papers', 'ap', { alwaysLowercase: ['von'] })
  assert.equal(out, 'The Ludwig von Beethoven Papers')
})

check('Empty input returns empty output', () => {
  assert.equal(capitalizeTitle('', 'apa'), '')
})

/* ------------------------------------------------------------------ */
group('Case transforms')

check('sentence case keeps proper nouns', () => {
  assert.equal(textCase.sentenceCase('THE REPORT FROM NASA ARRIVED ON MONDAY'), 'The report from NASA arrived on Monday')
})

check('proper case lowercases the tail', () => {
  assert.equal(textCase.properCase('jOHN sMITH'), 'John Smith')
})

check('first letter case preserves the tail', () => {
  assert.equal(textCase.firstLetterCase('iphone and ipad'), 'Iphone And Ipad')
})

check('toggle case inverts every letter', () => {
  assert.equal(textCase.toggleCase('Hello World'), 'hELLO wORLD')
})

check('alt case alternates by letter, not by character', () => {
  assert.equal(textCase.altCase('ab cd'), 'aB cD')
})

check('curly quotes convert both directions', () => {
  const curly = textCase.toCurlyQuotes('He said "hello" and left...')
  assert.equal(curly, 'He said “hello” and left…')
  assert.equal(textCase.toStraightQuotes(curly), 'He said "hello" and left...')
})

check('text stats count words and sentences', () => {
  const stats = textCase.textStats('One two three. Four five!')
  assert.equal(stats.words, 5)
  assert.equal(stats.sentences, 2)
})

check('headline scoring rewards length and numbers', () => {
  const weak = textCase.scoreHeadline('Writing')
  const strong = textCase.scoreHeadline('7 Proven Ways to Edit Your Draft Faster')
  assert.ok(strong.score > weak.score, `${strong.score} should beat ${weak.score}`)
  assert.ok(strong.score >= 50)
})

/* ------------------------------------------------------------------ */
group('Converters')

check('CSV parses quoted fields containing commas', () => {
  const rows = convert.parseCsv('a,b\n"x, y",z')
  assert.deepEqual(rows, [['a', 'b'], ['x, y', 'z']])
})

check('CSV parses escaped double quotes', () => {
  assert.deepEqual(convert.parseCsv('a\n"say ""hi"""'), [['a'], ['say "hi"']])
})

check('csvToJson types numbers and booleans', () => {
  const json = convert.csvToJson('name,age,active\nAda,36,true')
  assert.deepEqual(json, [{ name: 'Ada', age: 36, active: true }])
})

check('csvToJson can keep everything as strings', () => {
  const json = convert.csvToJson('zip\n01234', { parseNumbers: false })
  assert.equal(json[0].zip, '01234')
})

check('jsonToCsv flattens nested objects into dot columns', () => {
  const csv = convert.jsonToCsv([{ name: 'Ada', address: { city: 'London' } }])
  assert.equal(csv, 'name,address.city\nAda,London')
})

check('jsonToCsv escapes delimiters in values', () => {
  const csv = convert.jsonToCsv([{ note: 'a,b' }])
  assert.equal(csv, 'note\n"a,b"')
})

check('jsonToCsv unions keys across differing objects', () => {
  const csv = convert.jsonToCsv([{ a: 1 }, { b: 2 }])
  assert.equal(csv, 'a,b\n1,\n,2')
})

check('CSV → JSON → CSV round trips', () => {
  const original = 'name,city\nAda,London\nGrace,New York'
  const back = convert.jsonToCsv(convert.csvToJson(original))
  assert.equal(back, original)
})

check('listToColumn reverses a delimited line', () => {
  assert.equal(convert.listToColumn('a, b, c'), 'a\nb\nc')
})

check('safeParseJson reports the failure position', () => {
  const result = convert.safeParseJson('{"a": }')
  assert.equal(result.ok, false)
  assert.ok(result.error.length > 0)
})

/* ------------------------------------------------------------------ */
group('Generators')

check('title generator is deterministic for a seed', () => {
  const a = generators.generateTitles('blog', 'editing', { seed: 7, count: 5 })
  const b = generators.generateTitles('blog', 'editing', { seed: 7, count: 5 })
  assert.deepEqual(a, b)
  assert.equal(a.length, 5)
})

check('title generator changes output with the seed', () => {
  const a = generators.generateTitles('blog', 'editing', { seed: 1, count: 8 })
  const b = generators.generateTitles('blog', 'editing', { seed: 2, count: 8 })
  assert.notDeepEqual(a, b)
})

check('title generator leaves no unfilled placeholders', () => {
  for (const kind of Object.keys(generators.TITLE_TEMPLATES)) {
    for (const title of generators.generateTitles(kind, 'onboarding', { seed: 3, count: 10 })) {
      assert.ok(!/[{}]/.test(title), `${kind} produced "${title}"`)
    }
  }
})

check('poem and book titles work without a topic', () => {
  assert.equal(generators.generateTitles('poem', '', { seed: 4, count: 6 }).length, 6)
  assert.equal(generators.generateTitles('book', '', { seed: 4, count: 6 }).length, 6)
})

check('an ordinary word is not turned into an acronym', () => {
  // "IT", "ID" and "OK" are also normal words, so lowercase input must stay a word.
  assert.equal(capitalizeTitle('and how to fix it', 'ap'), 'And How to Fix It')
  assert.equal(capitalizeTitle('it is what it is', 'ap'), 'It Is What It Is')
  // Typed in capitals, they are still honoured.
  assert.equal(capitalizeTitle('my ID card', 'ap'), 'My ID Card')
  assert.equal(capitalizeTitle('watch it on TV', 'ap'), 'Watch It on TV')
  // Unambiguous acronyms are unaffected.
  assert.equal(capitalizeTitle('how nasa uses html', 'ap'), 'How NASA Uses HTML')
})

check('generated titles never repeat a template', () => {
  // Two titles from one template differ only in a filled word, which reads as
  // a bug: "50 X Mistakes…" beside "30 X Mistakes…".
  const titles = generators.generateTitles('blog', 'digital marketing', { count: 12, seed: 3 })
  const shapes = titles.map((t) => t.replace(/\d+/g, '#'))
  assert.equal(new Set(shapes).size, shapes.length, shapes.join(' | '))
})

check('a and an agree with the word that follows', () => {
  for (let seed = 1; seed <= 40; seed += 1) {
    for (const title of generators.generateTitles('blog', 'onboarding', { count: 12, seed })) {
      assert.ok(!/\bA [aeiouAEIOU]/.test(title), `"a" before a vowel: ${title}`)
      // Silent-h words correctly take "an", so stand them in as a vowel.
      const normalised = title.replace(/\b(hour|honest|honou?rable|heir)\w*/gi, 'apple')
      assert.ok(!/\ban [^aeiouAEIOU]/i.test(normalised), `"an" before a consonant: ${title}`)
    }
  }
})

check('a how-to topic is not doubled up by the template', () => {
  const titles = generators.generateTitles('blog', 'how to save money', { count: 12, seed: 5 })
  for (const title of titles) {
    assert.ok(!/how to .*how to/i.test(title), title)
    assert.ok(!/Guide to How to/i.test(title), title)
  }
})

check('an action topic is not framed as a possession', () => {
  for (const topic of ['save money', 'cooking biryani', 'learning guitar']) {
    for (const title of generators.generateTitles('blog', topic, { count: 12, seed: 8 })) {
      assert.ok(!/Your (save|cooking|learning)/i.test(title), title)
    }
  }
})

check('tone changes the titles that come back', () => {
  const opts = { seed: 11, count: 8 }
  const standard = generators.generateTitles('blog', 'onboarding', { ...opts, tone: 'standard' })
  for (const tone of ['casual', 'professional', 'funny', 'dramatic', 'clickbait', 'academic', 'poetic']) {
    const toned = generators.generateTitles('blog', 'onboarding', { ...opts, tone })
    assert.notDeepEqual(toned, standard, `${tone} produced the standard list`)
    assert.ok(toned.every((t) => !/[{}]/.test(t)), `${tone} left a placeholder`)
  }
})

check('book genre changes the imagery, not just the label', () => {
  const thriller = generators.generateTitles('book', '', { seed: 12, count: 10, genre: 'thriller' }).join(' ')
  const romance = generators.generateTitles('book', '', { seed: 12, count: 10, genre: 'romance' }).join(' ')
  assert.notEqual(thriller, romance)
  for (const genre of Object.keys(titleOptions.GENRE_BANKS)) {
    const titles = generators.generateTitles('book', '', { seed: 3, count: 8, genre })
    assert.equal(titles.length, 8, `${genre} produced ${titles.length} titles`)
    assert.ok(titles.every((t) => !/[{}]/.test(t)), `${genre} left a placeholder`)
  }
})

check('poem type selects form-specific titles', () => {
  const odes = generators.generateTitles('poem', '', { seed: 5, count: 6, poemType: 'ode' })
  assert.ok(odes.some((t) => t.startsWith('Ode')), odes.join(' | '))
  const elegies = generators.generateTitles('poem', '', { seed: 5, count: 6, poemType: 'elegy' })
  assert.ok(elegies.some((t) => t.startsWith('Elegy')), elegies.join(' | '))
  for (const option of titleOptions.POEM_TYPES) {
    const titles = generators.generateTitles('poem', '', { seed: 7, count: 5, poemType: option.value })
    assert.ok(titles.length > 0 && titles.every((t) => !/[{}]/.test(t)), `${option.value} failed`)
  }
})

check('essay type and grade both change the register', () => {
  const kid = generators.generateTitles('essay', 'water pollution', { seed: 9, count: 6, essayGrade: 'elementary' })
  const grad = generators.generateTitles('essay', 'water pollution', { seed: 9, count: 6, essayGrade: 'graduate' })
  assert.notDeepEqual(kid, grad)
  // Graduate titles should be noticeably longer than elementary ones.
  const avg = (list) => list.reduce((sum, t) => sum + t.length, 0) / list.length
  assert.ok(avg(grad) > avg(kid), `${avg(grad)} should exceed ${avg(kid)}`)

  for (const option of titleOptions.ESSAY_TYPES) {
    const titles = generators.generateTitles('essay', 'water pollution', { seed: 2, count: 5, essayType: option.value })
    assert.ok(titles.length > 0 && titles.every((t) => !/[{}]/.test(t)), `${option.value} failed`)
  }
})

check('every Use option maps to a real template family', () => {
  for (const option of titleOptions.USES) {
    const titles = generators.generateTitles(option.value, 'onboarding', { seed: 6, count: 5 })
    assert.equal(titles.length, 5, `${option.value} produced ${titles.length}`)
    assert.ok(titles.every((t) => !/[{}]/.test(t)), `${option.value} left a placeholder`)
  }
})

check('title rewriter returns every requested angle', () => {
  const results = generators.rewriteTitle('Some really useful tips for editing your writing', { seed: 1 })
  assert.equal(results.length, generators.REWRITE_ANGLES.length)
  assert.ok(results.every((r) => r.title.length > 0 && r.length === r.title.length))
})

check('title rewriter returns nothing for empty input', () => {
  assert.deepEqual(generators.rewriteTitle('   '), [])
})

check('name generator produces unique names and honours the start letter', () => {
  const names = generators.generateNames('fantasy', { count: 15, seed: 2, startsWith: 'a' })
  assert.equal(new Set(names).size, names.length)
  assert.ok(names.every((n) => n.toLowerCase().startsWith('a')))
})

check('every name style produces output', () => {
  for (const style of generators.NAME_STYLES) {
    const names = generators.generateNames(style.key, { count: 5, seed: 9 })
    assert.ok(names.length > 0, `${style.key} produced nothing`)
    assert.ok(names.every((n) => n.trim().length > 1))
  }
})

check('lorem ipsum honours unit and count', () => {
  assert.equal(generators.generateLorem({ unit: 'words', count: 25 }).split(/\s+/).length, 25)
  assert.equal(generators.generateLorem({ unit: 'paragraphs', count: 3 }).split('\n\n').length, 3)
  assert.ok(generators.generateLorem({ unit: 'paragraphs', count: 1, html: true }).startsWith('<p>'))
  assert.ok(generators.generateLorem({ unit: 'paragraphs', count: 1 }).startsWith('Lorem ipsum'))
})

check('poem, song, speech and backstory all produce text', () => {
  assert.ok(generators.generatePoem({ seed: 1, stanzas: 2 }).split('\n\n').length === 2)
  assert.ok(generators.generateSong({ seed: 1 }).includes('[Chorus]'))
  assert.ok(generators.generateSpeech({ seed: 1, topic: 'onboarding' }).length > 200)
  const story = generators.generateBackstory({ seed: 1, name: 'Wren', role: 'archivist' })
  assert.ok(story.text.includes('Wren'))
  assert.equal(Object.keys(story.beats).length, 6)
})

check('backstory uses "an" before a vowel-initial role', () => {
  const story = generators.generateBackstory({ seed: 5, name: 'Wren', role: 'archivist', length: 'long' })
  assert.ok(story.beats.skill.includes('an archivist'), story.beats.skill)
})

check('random states never repeat within a draw', () => {
  const states = generators.randomStates({ count: 50, seed: 1 })
  assert.equal(new Set(states.map((s) => s.abbr)).size, 50)
})

check('text repeater respects count and separator', () => {
  assert.equal(generators.repeatText('ab', { times: 3, separator: '-' }), 'ab-ab-ab')
  assert.equal(generators.repeatText('ab', { times: 2, numbered: true, separator: '\n' }), '1. ab\n2. ab')
})

check('prompt generator produces both text and image prompts', () => {
  assert.equal(generators.generatePrompts({ kind: 'text', count: 4, seed: 1 }).length, 4)
  assert.ok(generators.generatePrompts({ kind: 'image', count: 1, seed: 1 })[0].includes('4k'))
})

/* ------------------------------------------------------------------ */
group('Unicode styles')

check('every style maps the full alphabet', () => {
  for (const style of unicode.UNICODE_STYLES) {
    const out = unicode.toUnicodeStyle('abcdefghijklmnopqrstuvwxyz', style.key)
    const unmapped = [...'abcdefghijklmnopqrstuvwxyz'].filter((ch) => out.includes(ch) && style.map[ch] === undefined)
    assert.equal(unmapped.length, 0, `${style.key} is missing: ${unmapped.join('')}`)
  }
})

check('bold and bubble styles actually change the text', () => {
  assert.notEqual(unicode.toUnicodeStyle('hello', 'bold'), 'hello')
  assert.notEqual(unicode.toUnicodeStyle('hello', 'circled'), 'hello')
})

check('upside down style reverses the string', () => {
  const out = unicode.toUnicodeStyle('abc', 'upsideDown')
  assert.equal([...out].length, 3)
})

check('combining marks are applied per character', () => {
  assert.equal([...unicode.applyCombining('ab', '̶')].length, 4)
})

check('invisible characters are all distinct', () => {
  const chars = unicode.INVISIBLE_CHARACTERS.map((c) => c.char)
  assert.equal(new Set(chars).size, chars.length)
})

check('the data converter handles every text format pair', () => {
  const csv = 'name,role,years\nAda,Engineer,12\nGrace,Admiral,40'
  const opts = formats.DEFAULT_OPTIONS
  const textFormats = ['csv', 'tsv', 'json']

  for (const to of textFormats) {
    const result = formats.convertData(csv, 'csv', to, opts)
    assert.ok(result.ok, `csv → ${to} failed`)
    assert.ok(result.output.includes('Ada'), `csv → ${to} lost a value`)
    // And back again, without losing a row.
    const back = formats.convertData(result.output, to, 'csv', opts)
    assert.ok(back.ok, `${to} → csv failed`)
    assert.equal(back.table.rows.length, 2, `${to} → csv lost rows`)
  }
})

check('auto-detect picks the right delimiter', () => {
  assert.equal(formats.detectDelimiter('a,b,c'), ',')
  assert.equal(formats.detectDelimiter('a;b;c'), ';')
  assert.equal(formats.detectDelimiter('a\tb\tc'), '\t')
  assert.equal(formats.detectDelimiter('a|b|c'), '|')
})

check('JSON rows with different keys still line up as columns', () => {
  const json = '[{"a":1,"b":"x"},{"a":2,"c":true}]'
  const { output, ok } = formats.convertData(json, 'json', 'csv', formats.DEFAULT_OPTIONS)
  assert.ok(ok)
  // Every key appears once, and the missing cells stay empty rather than shifting.
  assert.equal(output, 'a,b,c\n1,x,\n2,,true')
})

check('quoting non-numbers keeps codes that only look numeric', () => {
  const csv = 'pin\n011234'
  const loose = formats.convertData(csv, 'csv', 'json', formats.DEFAULT_OPTIONS)
  assert.ok(loose.output.includes('11234'), 'expected the zero to be lost by default')

  const strict = formats.convertData(csv, 'csv', 'json', {
    ...formats.DEFAULT_OPTIONS,
    quoteNonNumbers: true,
  })
  assert.ok(strict.output.includes('"011234"'), strict.output)
})

check('empty trailing columns are dropped only when asked', () => {
  const csv = 'a,b,\n1,2,\n3,4,'
  const on = formats.convertData(csv, 'csv', 'csv', formats.DEFAULT_OPTIONS)
  assert.equal(on.table.headers.length, 2)

  const off = formats.convertData(csv, 'csv', 'csv', {
    ...formats.DEFAULT_OPTIONS,
    removeEmptyTrailingColumns: false,
  })
  assert.equal(off.table.headers.length, 3)
})

check('minify collapses the JSON output', () => {
  const csv = 'a\n1'
  const pretty = formats.convertData(csv, 'csv', 'json', formats.DEFAULT_OPTIONS).output
  const mini = formats.convertData(csv, 'csv', 'json', { ...formats.DEFAULT_OPTIONS, minifyJson: true }).output
  assert.ok(pretty.includes('\n'))
  assert.ok(!mini.includes('\n'))
})

check('invalid input reports the parser error instead of throwing', () => {
  const result = formats.convertData('{oops', 'json', 'csv', formats.DEFAULT_OPTIONS)
  assert.equal(result.ok, false)
  assert.ok(result.error.length > 0)
})

check('Excel output is handed over as rows for the spreadsheet writer', () => {
  const rows = formats.convertData('a,b\n1,2', 'csv', 'excel', formats.DEFAULT_OPTIONS).output
  assert.deepEqual(rows, [['a', 'b'], ['1', '2']])
  assert.equal(formats.isBinaryFormat('excel'), true)
  assert.equal(formats.isBinaryFormat('csv'), false)
})

check('comma separator joins a column with the chosen delimiter', () => {
  const { items, output } = convert.separateList('apple\nbanana\ncherry', { delimiter: ', ' })
  assert.deepEqual(items, ['apple', 'banana', 'cherry'])
  assert.equal(output, 'apple, banana, cherry')
})

check('comma separator quote styles escape correctly', () => {
  const single = convert.separateList("it's\nb", { delimiter: ',', quotes: 'single' })
  assert.equal(single.output, "'it''s','b'")
  const double = convert.separateList('say "hi"\nb', { delimiter: ',', quotes: 'double' })
  assert.equal(double.output, '"say ""hi""","b"')
  const none = convert.separateList('a\nb', { delimiter: ',', quotes: 'none' })
  assert.equal(none.output, 'a,b')
})

check('item and list wrappers build a full HTML list', () => {
  const { output } = convert.separateList('one\ntwo', {
    delimiter: '',
    itemPrefix: '<li>',
    itemSuffix: '</li>',
    listPrefix: '<ul>',
    listSuffix: '</ul>',
  })
  assert.equal(output, '<ul><li>one</li><li>two</li></ul>')
})

check('every cleanup switch does what its label says', () => {
  const base = { delimiter: ',' }

  assert.equal(convert.separateList('A\nB', { ...base, lowercase: true }).output, 'a,b')
  assert.equal(convert.separateList('a\nb', { ...base, reverse: true }).output, 'b,a')
  assert.equal(
    convert.separateList('a  b\nc', { ...base, removeExtraSpaces: true }).output,
    'a b,c',
  )
  assert.equal(
    convert.separateList('a  b\nc', { ...base, removeAllWhitespace: true }).output,
    'ab,c',
  )
  assert.equal(convert.separateList('a\na\nb', { ...base, removeDuplicates: true }).output, 'a,b')

  // Blank rows only disappear when the switch is on.
  assert.equal(convert.separateList('a\n\nb', { ...base, removeParagraphBreaks: true }).items.length, 2)
})

check('cleanup runs before de-duplication', () => {
  // "a " and "a" are the same value once spacing is normalised.
  const { items } = convert.separateList('a \na\nb', {
    delimiter: ',',
    removeExtraSpaces: true,
    removeDuplicates: true,
  })
  assert.deepEqual(items, ['a', 'b'])
})

check('a delimited line converts back into a column', () => {
  assert.equal(convert.listToColumn('apple, banana, cherry', ','), 'apple\nbanana\ncherry')
})

check('an empty column produces no wrapper output', () => {
  assert.equal(convert.separateList('', { delimiter: ',', listPrefix: '<ul>', listSuffix: '</ul>' }).output, '')
})

check('the fancy-text gallery exposes 40+ styles with unique keys and labels', () => {
  const styles = unicode.ALL_TEXT_STYLES
  assert.ok(styles.length >= 40, `only ${styles.length} styles`)
  assert.equal(new Set(styles.map((s) => s.key)).size, styles.length, 'duplicate keys')
  assert.equal(new Set(styles.map((s) => s.label)).size, styles.length, 'duplicate labels')
})

check('every gallery style transforms the text and preserves spaces', () => {
  for (const style of unicode.ALL_TEXT_STYLES) {
    const out = style.render('hello world')
    assert.ok(out.length > 0, `${style.key} returned nothing`)
    assert.notEqual(out, 'hello world', `${style.key} did not change the text`)
    if (style.key !== 'backwards') {
      assert.ok(out.includes(' '), `${style.key} lost the space`)
    }
  }
})

check('gallery styles leave the input untouched for empty text', () => {
  for (const style of unicode.ALL_TEXT_STYLES) {
    assert.equal(style.render(''), '', `${style.key} on empty input`)
  }
})

check('Wingdings and Webdings lead the gallery', () => {
  assert.equal(unicode.ALL_TEXT_STYLES[0].label, 'Wingdings')
  assert.equal(unicode.ALL_TEXT_STYLES[1].label, 'Webdings')
})

check('emoji letters stay separate instead of forming flags', () => {
  const out = unicode.DECORATOR_BY_KEY.get('emoji').render('gb')
  assert.ok(out.includes('​'), 'expected a zero-width space between regional indicators')
})

check('cursed text is deterministic', () => {
  const render = unicode.DECORATOR_BY_KEY.get('cursed').render
  assert.equal(render('hello'), render('hello'))
})

/* ------------------------------------------------------------------ */
group('Site structure')

check('every page has a unique path', () => {
  const paths = nav.ALL_PAGES.map((p) => p.path)
  assert.equal(new Set(paths).size, paths.length)
})

check('every page has complete SEO metadata', () => {
  for (const page of nav.ALL_PAGES) {
    assert.ok(page.title?.length > 10, `${page.path} title`)
    assert.ok(page.description?.length > 80, `${page.path} description too short`)
    assert.ok(page.description.length < 200, `${page.path} description too long (${page.description.length})`)
    assert.ok(page.keywords?.length > 0, `${page.path} keywords`)
    assert.ok(page.h1?.length > 0, `${page.path} h1`)
    assert.ok(page.key, `${page.path} component key`)
  }
})

check('every menu item resolves to a registered page', () => {
  const known = new Set(nav.ALL_PAGES.map((p) => p.path))
  for (const group of nav.TOOL_GROUPS) {
    for (const item of group.items) {
      assert.ok(known.has(item.path), `Tools menu links to unregistered ${item.path}`)
    }
  }
  for (const category of nav.BLOG_CATEGORIES) {
    assert.ok(known.has(category.path), `Blog menu links to unregistered ${category.path}`)
  }
})

check('no page or copy still points at a removed section', () => {
  const serialised = JSON.stringify([nav.ALL_PAGES, nav.TOOL_GROUPS, posts.POSTS])

  for (const prefix of ['/play', '/gpts']) {
    assert.equal(nav.ALL_PAGES.filter((p) => p.path.startsWith(prefix)).length, 0, `${prefix} page still registered`)
    assert.ok(!serialised.includes(`${prefix}/`), `a ${prefix}/ link survives somewhere in the content`)
  }

  // Word Tools lived under /tools/, so it needs an exact-path check.
  for (const slug of ['pangram-solver', 'anagram-solver', 'word-finder', 'rhyming-dictionary']) {
    const path = `/tools/${slug}`
    assert.equal(nav.ALL_PAGES.filter((p) => p.path === path).length, 0, `${path} still registered`)
    assert.ok(!serialised.includes(path), `a link to ${path} survives somewhere in the content`)
  }
})

check('every blog post has a category that exists', () => {
  const slugs = new Set(nav.BLOG_CATEGORIES.map((c) => c.slug))
  for (const post of posts.POSTS) {
    assert.ok(slugs.has(post.category), `${post.slug} → ${post.category}`)
    assert.ok(post.description.length > 80 && post.description.length < 200, `${post.slug} description length`)
    assert.ok(post.body.length > 1500, `${post.slug} body too short`)
  }
})

check('related tools never include the current page', () => {
  for (const tool of nav.ALL_TOOLS) {
    const related = nav.relatedTools(tool.path)
    assert.ok(!related.some((r) => r.path === tool.path), `${tool.path} links to itself`)
    assert.ok(related.length > 0)
  }
})

/* ------------------------------------------------------------------ */
console.log(`\n${passed} passed, ${failed} failed`)
if (failed) process.exitCode = 1
