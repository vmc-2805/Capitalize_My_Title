/**
 * Format-to-format conversion for the CSV/JSON/TSV/Excel converter.
 *
 * Everything routes through one intermediate shape — a `{ headers, rows }`
 * table — so adding a format means writing one reader and one writer rather
 * than a new function for every pair. Excel is the exception that proves the
 * rule: it is binary, so it can only arrive as a file and can only leave as a
 * download.
 */

import { escapeCsvField, parseCsv } from './convert.js'

export const FORMATS = [
  { value: 'csv', label: 'CSV', extension: 'csv', binary: false },
  { value: 'tsv', label: 'TSV', extension: 'tsv', binary: false },
  { value: 'json', label: 'JSON', extension: 'json', binary: false },
  { value: 'excel', label: 'Excel', extension: 'xlsx', binary: true },
]

export const FORMAT_BY_VALUE = new Map(FORMATS.map((f) => [f.value, f]))

export const isBinaryFormat = (format) => Boolean(FORMAT_BY_VALUE.get(format)?.binary)

export const DELIMITERS = [
  { value: 'auto', label: 'Auto-detect' },
  { value: ',', label: 'Comma' },
  { value: '\t', label: 'Tab' },
  { value: ';', label: 'Semicolon' },
  { value: '|', label: 'Pipe' },
]

export const DEFAULT_OPTIONS = {
  delimiter: 'auto',
  includeHeader: true,
  minifyJson: false,
  trimValues: true,
  quoteNonNumbers: false,
  removeEmptyTrailingColumns: true,
}

/** Picks the delimiter that produces the most columns on the first line. */
export function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim() !== '') || ''
  const candidates = [',', '\t', ';', '|']
  let best = ','
  let bestCount = 0
  for (const candidate of candidates) {
    const count = parseCsv(firstLine, candidate)[0]?.length ?? 0
    if (count > bestCount) {
      bestCount = count
      best = candidate
    }
  }
  return best
}

const isNumeric = (value) => value !== '' && value !== null && Number.isFinite(Number(value))

/* ------------------------------------------------------------------ */
/* Readers — any format in, one table out                              */
/* ------------------------------------------------------------------ */

/**
 * Empty headings are deliberately left blank here rather than named
 * `column_n`. Naming them first would make an empty trailing column look
 * populated, so `cleanTable` drops the empties and names whatever survives.
 */
function rowsToTable(rows, includeHeader) {
  if (!rows.length) return { headers: [], rows: [] }
  if (!includeHeader) {
    const width = Math.max(...rows.map((r) => r.length))
    return { headers: Array.from({ length: width }, () => ''), rows }
  }
  const [head, ...body] = rows
  return { headers: head.map((h) => String(h ?? '')), rows: body }
}

const nameBlankHeaders = (headers) =>
  headers.map((h, i) => (String(h).trim() === '' ? `column_${i + 1}` : String(h)))

function readDelimited(text, delimiter, options) {
  const actual = delimiter === 'auto' ? detectDelimiter(text) : delimiter
  const rows = parseCsv(text, actual).filter((row) => row.some((cell) => String(cell).trim() !== ''))
  return rowsToTable(rows, options.includeHeader)
}

function readJson(text) {
  const parsed = JSON.parse(text)
  const list = Array.isArray(parsed) ? parsed : [parsed]

  // An array of arrays is already a table; an array of objects needs its keys
  // collected across every row, because rows do not have to agree.
  if (list.length && Array.isArray(list[0])) return rowsToTable(list.map((r) => r.map(String)), true)

  const headers = []
  for (const item of list) {
    for (const key of Object.keys(item ?? {})) if (!headers.includes(key)) headers.push(key)
  }
  const rows = list.map((item) =>
    headers.map((key) => {
      const value = item?.[key]
      if (value === null || value === undefined) return ''
      return typeof value === 'object' ? JSON.stringify(value) : String(value)
    }),
  )
  return { headers, rows }
}

/* ------------------------------------------------------------------ */
/* Writers — one table in, any format out                              */
/* ------------------------------------------------------------------ */

function writeDelimited(table, delimiter, options) {
  const lines = []
  if (options.includeHeader) lines.push(table.headers.map((h) => escapeCsvField(h, delimiter)).join(delimiter))
  for (const row of table.rows) {
    lines.push(
      table.headers
        .map((_, i) => {
          const value = row[i] ?? ''
          if (options.quoteNonNumbers && !isNumeric(value)) return `"${String(value).replace(/"/g, '""')}"`
          return escapeCsvField(value, delimiter)
        })
        .join(delimiter),
    )
  }
  return lines.join('\n')
}

function writeJson(table, options) {
  const coerce = (value) => {
    if (options.quoteNonNumbers) return String(value)
    if (value === '') return ''
    if (isNumeric(value)) return Number(value)
    if (value === 'true') return true
    if (value === 'false') return false
    if (value === 'null') return null
    return value
  }

  const data = options.includeHeader
    ? table.rows.map((row) => Object.fromEntries(table.headers.map((h, i) => [h, coerce(row[i] ?? '')])))
    : table.rows.map((row) => row.map(coerce))

  return JSON.stringify(data, null, options.minifyJson ? 0 : 2)
}

/* ------------------------------------------------------------------ */
/* Table clean-up                                                      */
/* ------------------------------------------------------------------ */

function cleanTable(table, options) {
  let { headers, rows } = table

  if (options.trimValues) {
    headers = headers.map((h) => String(h).trim())
    rows = rows.map((row) => row.map((cell) => String(cell ?? '').trim()))
  }

  if (options.removeEmptyTrailingColumns) {
    // Spreadsheet exports routinely carry a tail of empty columns.
    let width = headers.length
    while (
      width > 1 &&
      String(headers[width - 1] ?? '').trim() === '' &&
      rows.every((row) => String(row[width - 1] ?? '').trim() === '')
    ) {
      width -= 1
    }
    headers = headers.slice(0, width)
    rows = rows.map((row) => row.slice(0, width))
  }

  return { headers: nameBlankHeaders(headers), rows }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/**
 * Reads text (or an already-parsed Excel table) into the intermediate table.
 * Excel input arrives as rows because only the file reader can decode it.
 */
export function readTable(input, format, options = DEFAULT_OPTIONS) {
  if (format === 'excel') return cleanTable(rowsToTable(input || [], options.includeHeader), options)
  if (format === 'json') return cleanTable(readJson(input), options)
  const delimiter = format === 'tsv' ? '\t' : options.delimiter
  return cleanTable(readDelimited(input, delimiter, options), options)
}

/** Serialises the table. Excel returns rows for the caller to hand to SheetJS. */
export function writeTable(table, format, options = DEFAULT_OPTIONS) {
  if (format === 'json') return writeJson(table, options)
  if (format === 'excel') {
    return options.includeHeader ? [table.headers, ...table.rows] : table.rows
  }
  return writeDelimited(table, format === 'tsv' ? '\t' : options.delimiter === 'auto' ? ',' : options.delimiter, options)
}

/**
 * Converts text from one format to another. Returns `{ ok, output, table }`
 * or `{ ok: false, error }` so the UI can show the parser's own message.
 */
export function convertData(input, from, to, options = DEFAULT_OPTIONS) {
  if (!String(input ?? '').trim() && from !== 'excel') return { ok: true, output: '', table: { headers: [], rows: [] } }

  try {
    const table = readTable(input, from, options)
    return { ok: true, output: writeTable(table, to, options), table }
  } catch (error) {
    return { ok: false, error: error.message }
  }
}
