/* CSV / JSON / column conversion helpers. All parsing is RFC-4180 aware. */

export function parseCsv(text, delimiter = ',') {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i]

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
    } else if (ch === delimiter) {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else if (ch !== '\r') {
      field += ch
    }
  }

  if (field !== '' || row.length) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

const needsQuotes = (value, delimiter) =>
  value.includes(delimiter) || value.includes('"') || /[\n\r]/.test(value) || /^\s|\s$/.test(value)

export const escapeCsvField = (value, delimiter = ',') => {
  const str = value == null ? '' : String(value)
  return needsQuotes(str, delimiter) ? `"${str.replace(/"/g, '""')}"` : str
}

export const toCsv = (rows, delimiter = ',', eol = '\n') =>
  rows.map((row) => row.map((cell) => escapeCsvField(cell, delimiter)).join(delimiter)).join(eol)

/** CSV text → array of objects keyed by the header row. */
export function csvToJson(text, options = {}) {
  const { delimiter = ',', hasHeader = true, parseNumbers = true, parseBooleans = true } = options
  const rows = parseCsv(text, delimiter)
  if (!rows.length) return []

  const coerce = (value) => {
    const v = value.trim()
    if (v === '') return ''
    if (parseBooleans && /^(true|false)$/i.test(v)) return v.toLowerCase() === 'true'
    if (parseBooleans && /^null$/i.test(v)) return null
    if (parseNumbers && /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v)) return Number(v)
    return value
  }

  if (!hasHeader) return rows.map((row) => row.map(coerce))

  const headers = rows[0].map((h, i) => h.trim() || `column_${i + 1}`)
  return rows.slice(1).map((row) =>
    headers.reduce((obj, key, i) => {
      obj[key] = coerce(row[i] ?? '')
      return obj
    }, {}),
  )
}

/** Flattens nested objects so `{a:{b:1}}` becomes `{'a.b': 1}`. */
export function flatten(value, prefix = '', out = {}) {
  if (value === null || typeof value !== 'object') {
    out[prefix || 'value'] = value
    return out
  }
  if (Array.isArray(value)) {
    if (value.every((v) => v === null || typeof v !== 'object')) {
      out[prefix] = value.join('; ')
      return out
    }
    value.forEach((item, i) => flatten(item, prefix ? `${prefix}.${i}` : String(i), out))
    return out
  }
  for (const [key, val] of Object.entries(value)) {
    flatten(val, prefix ? `${prefix}.${key}` : key, out)
  }
  return out
}

/** JSON (array of objects, or a single object) → CSV text. */
export function jsonToCsv(input, options = {}) {
  const { delimiter = ',', includeHeader = true, flattenNested = true } = options
  const data = Array.isArray(input) ? input : [input]
  if (!data.length) return ''

  const prepared = data.map((item) => {
    if (item === null || typeof item !== 'object') return { value: item }
    return flattenNested ? flatten(item) : item
  })

  const headers = []
  for (const row of prepared) {
    for (const key of Object.keys(row)) if (!headers.includes(key)) headers.push(key)
  }

  const body = prepared.map((row) =>
    headers.map((key) => {
      const v = row[key]
      if (v === undefined || v === null) return ''
      return typeof v === 'object' ? JSON.stringify(v) : String(v)
    }),
  )

  return toCsv(includeHeader ? [headers, ...body] : body, delimiter)
}

/** One item per line → a single delimited line (the "comma separator" tool). */
/**
 * Turns a column of values into one delimited line.
 *
 * The option set mirrors the reference tool this page is modelled on: quote
 * style, per-item and whole-list wrappers, and seven cleanup switches. The
 * order below matters — cleaning happens before de-duplication, so two rows
 * that differ only in spacing collapse into one.
 */
export function separateList(text, options = {}) {
  const {
    delimiter = ',',
    quotes = 'none',
    itemPrefix = '',
    itemSuffix = '',
    listPrefix = '',
    listSuffix = '',
    lowercase = false,
    reverse = false,
    removeLineBreaks = true,
    removeParagraphBreaks = true,
    removeExtraSpaces = false,
    removeAllWhitespace = false,
    removeDuplicates = false,
  } = options

  let items = text.split(/\r?\n/)

  // A "paragraph break" is a blank row between values.
  if (removeParagraphBreaks) items = items.filter((i) => i.trim() !== '')
  if (removeLineBreaks) items = items.map((i) => i.replace(/[\r\n]+/g, ' '))
  if (removeExtraSpaces) items = items.map((i) => i.replace(/\s+/g, ' ').trim())
  if (removeAllWhitespace) items = items.map((i) => i.replace(/\s+/g, ''))
  if (lowercase) items = items.map((i) => i.toLowerCase())

  items = items.map((i) => i.trim()).filter((i) => i !== '')

  if (removeDuplicates) items = [...new Set(items)]
  if (reverse) items = [...items].reverse()

  const quote = (item) => {
    if (quotes === 'double') return `"${item.replace(/"/g, '""')}"`
    if (quotes === 'single') return `'${item.replace(/'/g, "''")}'`
    return item
  }

  const body = items.map((item) => `${itemPrefix}${quote(item)}${itemSuffix}`).join(delimiter)

  return { items, output: items.length ? `${listPrefix}${body}${listSuffix}` : '' }
}

export const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Turns a delimited line back into one item per line. */
export function listToColumn(text, delimiter = ',') {
  return text
    .split(new RegExp(escapeRegExp(delimiter)))
    .map((i) => i.trim())
    .filter(Boolean)
    .join('\n')
}

export function prettyJson(text, indent = 2) {
  const parsed = JSON.parse(text)
  return JSON.stringify(parsed, null, indent)
}

export function safeParseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) }
  } catch (error) {
    // Surface the line and column so the user can jump straight to the problem.
    const match = /position (\d+)/.exec(error.message)
    let where = ''
    if (match) {
      const pos = Number(match[1])
      const before = text.slice(0, pos)
      const line = before.split('\n').length
      const column = pos - before.lastIndexOf('\n')
      where = ` (line ${line}, column ${column})`
    }
    return { ok: false, error: error.message.replace(/^JSON\.parse: /, '') + where }
  }
}
