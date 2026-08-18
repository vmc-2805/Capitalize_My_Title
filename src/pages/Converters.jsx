import { useEffect, useMemo, useRef, useState } from 'react'
import ToolShell from '../components/ToolShell.jsx'
import {
  Callout,
  CopyButton,
  DownloadButton,
  Field,
  Icon,
  NumberInput,
  OutputBox,
  ResetButton,
  Select,
  StatGrid,
  Toggle,
  resetControls,
} from '../components/ui.jsx'
import { listToColumn, separateList } from '../lib/convert.js'
import {
  DEFAULT_OPTIONS,
  DELIMITERS,
  FORMATS,
  FORMAT_BY_VALUE,
  convertData,
  isBinaryFormat,
} from '../lib/dataFormats.js'
import { applyCaseAction } from '../lib/textCase.js'
import { STYLE_GUIDES } from '../lib/capitalize.js'

/* ================================================================== */
/* Comma Separator                                                     */
/* ================================================================== */

/**
 * The delimiter is stored as a character code, which is how the reference tool
 * takes it. A code is the only way to type a tab or a newline into a text box,
 * and the quick-pick buttons cover the common cases so nobody has to know that.
 */
const DELIMITER_PRESETS = [
  { code: 44, label: 'Comma' },
  { code: 59, label: 'Semicolon' },
  { code: 124, label: 'Pipe' },
  { code: 9, label: 'Tab' },
  { code: 32, label: 'Space' },
  { code: 10, label: 'New line' },
]

const codeToChar = (code) => {
  const n = Number(code)
  return Number.isFinite(n) && n > 0 ? String.fromCharCode(n) : ','
}

const describeChar = (code) => {
  const n = Number(code)
  if (n === 9) return 'tab'
  if (n === 10) return 'new line'
  if (n === 32) return 'space'
  const preset = DELIMITER_PRESETS.find((d) => d.code === n)
  return preset ? `"${String.fromCharCode(n)}"` : `"${codeToChar(code)}"`
}

const QUOTE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'double', label: 'Double' },
  { value: 'single', label: 'Single' },
]

const CLEANUP_SWITCHES = [
  { key: 'lowercase', label: 'Lowercase list' },
  { key: 'reverse', label: 'Reverse list' },
  { key: 'removeLineBreaks', label: 'Remove line breaks' },
  { key: 'removeParagraphBreaks', label: 'Remove paragraph breaks' },
  { key: 'removeExtraSpaces', label: 'Remove extra spaces' },
  { key: 'removeAllWhitespace', label: 'Remove all whitespace' },
  { key: 'removeDuplicates', label: 'Remove duplicates' },
]

const SWITCH_DEFAULTS = {
  lowercase: false,
  reverse: false,
  removeLineBreaks: true,
  removeParagraphBreaks: true,
  removeExtraSpaces: false,
  removeAllWhitespace: false,
  removeDuplicates: false,
}

export function CommaSeparator() {
  const [column, setColumn] = useState('')
  const [delimiterCode, setDelimiterCode] = useState(44)
  const [quotes, setQuotes] = useState('none')
  const [itemPrefix, setItemPrefix] = useState('')
  const [itemSuffix, setItemSuffix] = useState('')
  const [listPrefix, setListPrefix] = useState('')
  const [listSuffix, setListSuffix] = useState('')
  const [switches, setSwitches] = useState(SWITCH_DEFAULTS)
  const [showSettings, setShowSettings] = useState(true)

  const delimiter = codeToChar(delimiterCode)

  const result = useMemo(
    () =>
      separateList(column, {
        delimiter,
        quotes,
        itemPrefix,
        itemSuffix,
        listPrefix,
        listSuffix,
        ...switches,
      }),
    [column, delimiter, quotes, itemPrefix, itemSuffix, listPrefix, listSuffix, switches],
  )

  // Editing the delimited box converts the other way, so either side can be
  // the one you paste into.
  const onDelimitedChange = (value) => setColumn(listToColumn(value, delimiter))

  const { dirty, reset } = resetControls([
    [column, setColumn, ''],
    [delimiterCode, setDelimiterCode, 44],
    [quotes, setQuotes, 'none'],
    [itemPrefix, setItemPrefix, ''],
    [itemSuffix, setItemSuffix, ''],
    [listPrefix, setListPrefix, ''],
    [listSuffix, setListSuffix, ''],
  ])

  const switchesDirty = CLEANUP_SWITCHES.some((s) => switches[s.key] !== SWITCH_DEFAULTS[s.key])
  const resetAll = () => {
    reset()
    setSwitches(SWITCH_DEFAULTS)
  }

  const toggleSwitch = (key) => (checked) => setSwitches((current) => ({ ...current, [key]: checked }))

  return (
    <ToolShell
      path="/tools/comma-separator"
      howTo={{
        steps: [
          'Paste your column into the left box — one item per line, straight from Excel or Google Sheets.',
          'The delimited list appears on the right as you type. Press Copy to take it.',
          'Open <strong>Settings</strong> to change the separator, add quotes, or wrap each item in tags.',
          'You can also paste a delimited list into the right box to turn it back into a column.',
        ],
      }}
      faqs={[
        {
          q: 'How do I turn an Excel column into a comma separated list?',
          a: 'Select the column in Excel or Google Sheets, copy it, and paste it into the left box. Each cell arrives on its own line and the joined list appears on the right straight away. There is no button to press.',
        },
        {
          q: 'Can I put quotes around each item for a SQL query?',
          a: 'Yes. In Settings set Quotes to Single and leave the separator as a comma. You get \'a\',\'b\',\'c\' — ready to paste inside a SQL IN clause.',
        },
        {
          q: 'What is the number in the delimiter box?',
          a: 'It is the character code of your separator. 44 is a comma, 59 a semicolon, 124 a pipe, 9 a tab and 10 a new line. Codes are used because a tab or a new line cannot be typed into a normal text box. The quick buttons set it for you.',
        },
        {
          q: 'What do the item and list prefixes do?',
          a: 'The item prefix and suffix wrap every single value, so &lt;li&gt; and &lt;/li&gt; turn your column into list items. The list prefix and suffix wrap the whole result once, so &lt;ul&gt; and &lt;/ul&gt; close it off. Together they build a full HTML list in one step.',
        },
        {
          q: 'Can it work the other way around?',
          a: 'Yes. Type or paste into the right box instead and the left box fills with one item per line, ready to paste back into a spreadsheet column.',
        },
        {
          q: 'Is there a limit on how many items I can paste?',
          a: 'No. The work happens in your browser, so a list of ten thousand rows is fine. Nothing is uploaded and nothing is counted.',
        },
      ]}
      about={`
        <h2>What this tool is for</h2>
        <p>Spreadsheets keep values in a column. Code, settings files and database queries want them on one line. This tool sits between the two. Paste a column of email addresses, product codes, IDs or names, and get back a single line in exactly the shape you need.</p>
        <h2>Common uses</h2>
        <ul>
          <li><strong>SQL IN queries</strong> — quotes set to Single, separator a comma.</li>
          <li><strong>CSV cells</strong> — comma separator, quotes off.</li>
          <li><strong>Tag and keyword boxes</strong> — comma separator with "Remove extra spaces" on.</li>
          <li><strong>HTML lists</strong> — item prefix <code>&lt;li&gt;</code>, item suffix <code>&lt;/li&gt;</code>, list prefix <code>&lt;ul&gt;</code>, list suffix <code>&lt;/ul&gt;</code>.</li>
          <li><strong>Email "To" field</strong> — semicolon for Outlook, comma for Gmail.</li>
        </ul>
        <h2>The cleanup switches</h2>
        <p>Data copied out of a spreadsheet or a PDF is rarely clean. <strong>Remove paragraph breaks</strong> drops the blank rows, and <strong>remove extra spaces</strong> collapses double spaces and trims the ends. Both are applied before <strong>remove duplicates</strong>, so two rows that differ only in spacing are correctly treated as the same value.</p>
      `}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <label className="label mb-0" htmlFor="cs-input">
              Your column — one item per line
            </label>
            <button
              type="button"
              className="text-xs font-semibold text-brand-700 hover:underline"
              onClick={() => setColumn('apple\nbanana\ncherry\ndamson')}
            >
              Load sample
            </button>
          </div>
          <textarea
            id="cs-input"
            rows={12}
            className="field font-mono text-[13px]"
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            placeholder={'apple\nbanana\ncherry'}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <label className="label mb-0" htmlFor="cs-output">
              Delimited list — editable
            </label>
            <span className="text-xs text-ink-500">List items: {result.items.length}</span>
          </div>
          <textarea
            id="cs-output"
            rows={12}
            className="field font-mono text-[13px]"
            value={result.output}
            onChange={(e) => onDelimitedChange(e.target.value)}
            placeholder="apple, banana, cherry"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton value={result.output} label="Copy list" className="btn-primary" />
            <DownloadButton value={result.output} filename="list.csv" mime="text/csv" label="Save CSV" />
            <ResetButton reset={resetAll} dirty={dirty || switchesDirty} />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => setShowSettings((o) => !o)}
          aria-expanded={showSettings}
          className="flex w-full cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 text-sm font-semibold text-ink-700"
        >
          Settings
          <Icon.chevronDown className={`transition ${showSettings ? 'rotate-180' : ''}`} />
        </button>

        {showSettings && (
          <div className="border-t border-gray-200 p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Field label="Delimiter" hint={`Character code — currently ${describeChar(delimiterCode)}`} htmlFor="cs-delim">
                  <NumberInput id="cs-delim" value={delimiterCode} onChange={setDelimiterCode} min={1} max={65535} />
                </Field>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {DELIMITER_PRESETS.map((preset) => (
                    <button
                      key={preset.code}
                      type="button"
                      onClick={() => setDelimiterCode(preset.code)}
                      className={`cursor-pointer rounded px-2 py-1 text-xs font-semibold transition ${
                        Number(delimiterCode) === preset.code
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-100 text-ink-700 hover:bg-gray-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="label">Quotes around each item</span>
                <div className="flex gap-1.5">
                  {QUOTE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setQuotes(option.value)}
                      className={`cursor-pointer rounded px-3 py-1.5 text-xs font-semibold transition ${
                        quotes === option.value
                          ? 'bg-brand-600 text-white'
                          : 'bg-gray-100 text-ink-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Item prefix" htmlFor="cs-item-prefix">
                  <input
                    id="cs-item-prefix"
                    className="field font-mono"
                    value={itemPrefix}
                    onChange={(e) => setItemPrefix(e.target.value)}
                    placeholder="&lt;li&gt;"
                  />
                </Field>
                <Field label="Item suffix" htmlFor="cs-item-suffix">
                  <input
                    id="cs-item-suffix"
                    className="field font-mono"
                    value={itemSuffix}
                    onChange={(e) => setItemSuffix(e.target.value)}
                    placeholder="&lt;/li&gt;"
                  />
                </Field>
                <Field label="List prefix" htmlFor="cs-list-prefix">
                  <input
                    id="cs-list-prefix"
                    className="field font-mono"
                    value={listPrefix}
                    onChange={(e) => setListPrefix(e.target.value)}
                    placeholder="&lt;ul&gt;"
                  />
                </Field>
                <Field label="List suffix" htmlFor="cs-list-suffix">
                  <input
                    id="cs-list-suffix"
                    className="field font-mono"
                    value={listSuffix}
                    onChange={(e) => setListSuffix(e.target.value)}
                    placeholder="&lt;/ul&gt;"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-4 grid gap-x-8 gap-y-2.5 border-t border-gray-200 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {CLEANUP_SWITCHES.map((item) => (
                <Toggle
                  key={item.key}
                  checked={switches[item.key]}
                  onChange={toggleSwitch(item.key)}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  )
}

/* ================================================================== */
/* Data converter — CSV, TSV, JSON and Excel in any direction          */
/* ================================================================== */

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

const ABOUT_DATA_CONVERTER = `
  <h2>Why the delimiter matters</h2>
  <p>"CSV" is not one single format. Files exported in Europe often use semicolons, because there the comma is used as a decimal point. Files coming out of a database often use tabs. Auto-detect handles most of it, but you can always set it yourself in Settings.</p>
  <h2>What happens to nested data</h2>
  <p>A table has rows and columns, and JSON does not have to. When JSON goes into a table, a nested object or array is written into the cell as JSON text rather than being thrown away. Converting back gives you that text again, so nothing is lost even though the shape flattens.</p>
  <h2>Opening the result without damage</h2>
  <p>Spreadsheet apps change your data while importing a CSV. Long numbers become scientific notation, and anything that looks like a date gets converted into one. If your data has IDs, phone numbers or product codes, convert to Excel instead. The values are stored with their type, so nothing gets reinterpreted on the way in.</p>
`

const SAMPLE_BY_FORMAT = {
  csv: 'name,role,years,active\nAda Lovelace,Engineer,12,true\n"Grace Hopper, PhD",Admiral,40,true\nKatherine Johnson,Mathematician,33,false',
  tsv: 'name\trole\tyears\tactive\nAda Lovelace\tEngineer\t12\ttrue\nGrace Hopper\tAdmiral\t40\ttrue',
  json: '[\n  { "name": "Ada Lovelace", "role": "Engineer", "years": 12 },\n  { "name": "Grace Hopper", "role": "Admiral", "years": 40 }\n]',
  excel: '',
}

const SETTING_SWITCHES = [
  { key: 'includeHeader', label: 'Include header row' },
  { key: 'minifyJson', label: 'Minify JSON' },
  { key: 'trimValues', label: 'Trim headings and values' },
  { key: 'quoteNonNumbers', label: 'Surround non-numbers in quotes' },
  { key: 'removeEmptyTrailingColumns', label: 'Remove empty trailing columns' },
]

/**
 * One component drives both the CSV→JSON and JSON→CSV pages. They are the same
 * tool with different starting formats, which is also how the reference site
 * treats them.
 */
function DataConverter({ path, defaultFrom, defaultTo }) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const [input, setInput] = useState('')
  const [excelRows, setExcelRows] = useState(null)
  const [fileName, setFileName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [showSettings, setShowSettings] = useState(false)
  const [busy, setBusy] = useState(false)

  const result = useMemo(
    () => convertData(from === 'excel' ? excelRows : input, from, to, options),
    [input, excelRows, from, to, options],
  )

  const outputIsBinary = isBinaryFormat(to)
  const outputText = result.ok && !outputIsBinary ? result.output : ''

  const { dirty, reset } = resetControls([
    [from, setFrom, defaultFrom],
    [to, setTo, defaultTo],
    [input, setInput, ''],
    [excelRows, setExcelRows, null],
    [fileName, setFileName, ''],
    [uploadError, setUploadError, ''],
  ])

  const optionsDirty =
    SETTING_SWITCHES.some((item) => options[item.key] !== DEFAULT_OPTIONS[item.key]) ||
    options.delimiter !== DEFAULT_OPTIONS.delimiter

  const resetAll = () => {
    reset()
    setOptions(DEFAULT_OPTIONS)
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
    // Feeding the current output back in is what makes the swap useful rather
    // than merely tidy, but a binary result has nothing to feed back.
    if (!outputIsBinary && result.ok && result.output) {
      setInput(result.output)
      setExcelRows(null)
    }
  }

  const onFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploadError('')

    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('That file is larger than 5MB. Try splitting it first.')
      event.target.value = ''
      return
    }

    setFileName(file.name)
    setBusy(true)
    try {
      if (/\.(xlsx|xls)$/i.test(file.name)) {
        // Loaded on demand — the spreadsheet parser is far too large to ship
        // to everyone who only ever pastes CSV.
        const XLSX = await import('xlsx')
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        setExcelRows(XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' }))
        setFrom('excel')
        setInput('')
      } else {
        const text = await file.text()
        setInput(text)
        setExcelRows(null)
        if (/\.json$/i.test(file.name)) setFrom('json')
        else if (/\.tsv$/i.test(file.name)) setFrom('tsv')
        else setFrom('csv')
      }
    } catch (error) {
      setUploadError('Could not read that file: ' + error.message)
    } finally {
      setBusy(false)
      event.target.value = ''
    }
  }

  const saveFile = async () => {
    const extension = FORMAT_BY_VALUE.get(to)?.extension || 'txt'
    const name = (fileName || 'data').replace(/\.[^.]+$/, '') + '.' + extension

    if (outputIsBinary) {
      const XLSX = await import('xlsx')
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(result.output), 'Sheet1')
      XLSX.writeFile(workbook, name)
      return
    }

    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const setOption = (key) => (value) => setOptions((current) => ({ ...current, [key]: value }))

  return (
    <ToolShell
      path={path}
      howTo={{
        steps: [
          'Choose what you are converting <strong>from</strong> and <strong>to</strong>. The middle button swaps the direction.',
          'Paste your data into the left box, or upload a file of up to 5MB.',
          'The converted result appears on the right as you type.',
          'Press Copy, or Save file to download it. Excel always downloads, because a spreadsheet cannot be shown as text.',
        ],
      }}
      faqs={[
        {
          q: 'Is my file uploaded anywhere?',
          a: 'No. The file is read by your own browser and the whole conversion happens on your computer. No request goes out to any server, which is why the tool keeps working even if your internet stops after the page has loaded.',
        },
        {
          q: 'Which formats can it convert between?',
          a: 'CSV, TSV, JSON and Excel, in any direction. Excel can only come in as an uploaded file and can only go out as a download, because a spreadsheet is a binary file and not text.',
        },
        {
          q: 'What does auto-detect do for the delimiter?',
          a: 'It reads the first line of your data and tries a comma, tab, semicolon and pipe, then keeps whichever one splits it into the most columns. Set the delimiter yourself if your values contain commas and are not wrapped in quotes.',
        },
        {
          q: 'Why are my PIN codes losing their starting zeros?',
          a: 'Numbers become real numbers in JSON, so 011234 turns into 11234. Switch on "Surround non-numbers in quotes" to keep every value as text. Do this for PIN codes, phone numbers and any code that only looks like a number.',
        },
        {
          q: 'What is "remove empty trailing columns" for?',
          a: 'Spreadsheet exports often carry a tail of empty columns that nobody typed into. This drops any column at the far right that is empty in the heading and in every single row. It is on by default because it is almost always what you want.',
        },
        {
          q: 'How large a file can it handle?',
          a: 'Uploads are capped at 5MB. Pasted text has no limit beyond your own computer memory, since nothing is being sent anywhere.',
        },
      ]}
      about={ABOUT_DATA_CONVERTER}
    >
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[150px] flex-1">
            <Field label="Convert from" htmlFor="dc-from">
              <Select id="dc-from" value={from} onChange={setFrom} options={FORMATS} />
            </Field>
          </div>
          <button
            type="button"
            onClick={swap}
            title="Swap the two formats"
            aria-label="Swap the two formats"
            className="mb-0.5 cursor-pointer rounded-md border border-gray-300 bg-white p-2.5 text-ink-700 transition hover:border-brand-600 hover:text-brand-700"
          >
            <Icon.shuffle width={18} height={18} />
          </button>
          <div className="min-w-[150px] flex-1">
            <Field label="Convert to" htmlFor="dc-to">
              <Select id="dc-to" value={to} onChange={setTo} options={FORMATS} />
            </Field>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <label className="label mb-0" htmlFor="dc-input">
              Input
            </label>
            {SAMPLE_BY_FORMAT[from] && (
              <button
                type="button"
                className="text-xs font-semibold text-brand-700 hover:underline"
                onClick={() => {
                  setInput(SAMPLE_BY_FORMAT[from])
                  setExcelRows(null)
                }}
              >
                Load sample
              </button>
            )}
          </div>

          {from === 'excel' ? (
            <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-gray-300 bg-white p-6 text-center">
              <p className="text-sm text-ink-500">
                {excelRows
                  ? 'Loaded ' + excelRows.length + ' rows from ' + fileName + '.'
                  : 'Excel files are binary, so upload one below instead of pasting.'}
              </p>
            </div>
          ) : (
            <textarea
              id="dc-input"
              rows={13}
              className="field font-mono text-[13px]"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setExcelRows(null)
              }}
              placeholder="Paste data here"
            />
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="btn-secondary cursor-pointer">
              <Icon.download width={15} height={15} />
              Upload a file
              <input type="file" className="sr-only" accept=".csv,.tsv,.txt,.json,.xlsx,.xls" onChange={onFile} />
            </label>
            <span className="text-xs text-ink-500">{fileName || 'Max 5MB · CSV, TSV, JSON, XLSX'}</span>
          </div>

          {uploadError && (
            <div className="mt-3">
              <Callout tone="error">{uploadError}</Callout>
            </div>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <label className="label mb-0" htmlFor="dc-output">
              Output
            </label>
            <span className="text-xs text-ink-500">
              {result.ok
                ? result.table.rows.length + ' rows · ' + result.table.headers.length + ' columns'
                : 'Not valid'}
            </span>
          </div>

          {outputIsBinary ? (
            <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-gray-300 bg-white p-6 text-center">
              <p className="text-sm text-ink-500">
                An Excel file cannot be shown as text. Press <strong>Save file</strong> to download it.
              </p>
            </div>
          ) : (
            <textarea
              id="dc-output"
              rows={13}
              readOnly
              className="field bg-gray-50 font-mono text-[13px]"
              value={outputText}
              placeholder="Get formatted data here"
            />
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton value={outputText} label="Copy" className="btn-primary" disabled={outputIsBinary} />
            <button type="button" className="btn-secondary" onClick={saveFile} disabled={!result.ok || busy}>
              <Icon.download />
              Save file
            </button>
            <ResetButton reset={resetAll} dirty={dirty || optionsDirty} />
          </div>

          {!result.ok && (
            <div className="mt-3">
              <Callout tone="error" title="That input could not be read">
                {result.error}
              </Callout>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => setShowSettings((o) => !o)}
          aria-expanded={showSettings}
          className="flex w-full cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 text-sm font-semibold text-ink-700"
        >
          Settings
          <Icon.chevronDown className={`transition ${showSettings ? 'rotate-180' : ''}`} />
        </button>

        {showSettings && (
          <div className="border-t border-gray-200 p-4">
            <div className="max-w-xs">
              <Field label="Delimiter" hint="Used for CSV input and output" htmlFor="dc-delim">
                <Select id="dc-delim" value={options.delimiter} onChange={setOption('delimiter')} options={DELIMITERS} />
              </Field>
            </div>
            <div className="mt-4 grid gap-x-8 gap-y-2.5 border-t border-gray-200 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {SETTING_SWITCHES.map((item) => (
                <Toggle
                  key={item.key}
                  checked={options[item.key]}
                  onChange={setOption(item.key)}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  )
}

export function CsvToJson() {
  return <DataConverter path="/tools/csv-to-json" defaultFrom="csv" defaultTo="json" />
}

export function JsonToCsv() {
  return <DataConverter path="/tools/json-to-csv" defaultFrom="json" defaultTo="csv" />
}

/* ================================================================== */
/* Uppercase to Lowercase                                              */
/* ================================================================== */

const CASE_BUTTONS = [
  { key: 'lower', label: 'lowercase' },
  { key: 'sentence', label: 'Sentence case' },
  { key: 'title', label: 'Title Case' },
  { key: 'proper', label: 'Proper Case' },
  { key: 'upper', label: 'UPPERCASE' },
  { key: 'first', label: 'First Letter' },
  { key: 'alt', label: 'aLtErNaTiNg' },
  { key: 'toggle', label: 'ToGgLe' },
]

export function UppercaseToLowercase() {
  const [input, setInput] = useState('')
  const [action, setAction] = useState('lower')
  const [styleKey, setStyleKey] = useState('ap')

  const output = useMemo(() => applyCaseAction(input, action, styleKey), [input, action, styleKey])

  const { dirty, reset } = resetControls([
    [input, setInput, ''],
    [action, setAction, 'lower'],
    [styleKey, setStyleKey, 'ap'],
  ])

  return (
    <ToolShell
      path="/tools/uppercase-to-lowercase"
      howTo={{
        steps: [
          'Paste the ALL CAPS text you want to fix.',
          'Choose what you want: lowercase, sentence case, title case or proper case.',
          'If you chose Title Case, pick the style guide your college or office follows.',
          'Copy the fixed text, then check the names our list could not know about.',
        ],
      }}
      faqs={[
        {
          q: 'Will short forms like NASA stay in capitals?',
          a: 'If your text has a mix of capital and small letters, yes — anything already in capitals is kept. If the whole text is in capitals, there is nothing left to keep, so the tool uses a built-in list of common short forms, brand names and place names instead.',
        },
        {
          q: 'What is the difference between sentence case and proper case?',
          a: 'Sentence case puts a capital on the first word of each sentence and on names: "The report from NASA arrived". Proper case puts a capital on every word: "The Report From Nasa Arrived". Use sentence case for normal writing and proper case for names and addresses.',
        },
        {
          q: 'Can I fix a whole document at once?',
          a: 'Yes. There is no limit, and each line is handled separately, so your paragraphs and lists stay exactly as they were.',
        },
        {
          q: 'How do I avoid this problem next time?',
          a: 'If the capitals are only for looks, do not type them. Type normally and use CSS text-transform: uppercase in your design. It looks the same on screen, but the real text stays readable, searchable and easy to change later.',
        },
      ]}
      about={`
        <h2>Why ALL CAPS is hard to fix</h2>
        <p>Capital text has thrown away information. "NASA STUDY SHOWS ICE LOSS IN GREENLAND" gives no clue about which words had capitals originally, so any tool has to make a sensible guess. This tool uses three things for that guess: a list of common short forms, a list of names and places, and a list of brand names that have capitals inside them, such as iPhone and eBay.</p>
        <h2>The check you still have to do yourself</h2>
        <p>No built-in list can know the names in your particular document. After converting, look for people, companies, products and place names. Also check words that can be both ordinary and a name — apple and Apple, march and March, polish and Polish. That last group is the only place where an automatic tool will confidently give you the wrong answer.</p>
      `}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Your text" htmlFor="ul-input">
          <textarea
            id="ul-input"
            rows={12}
            className="field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="PASTE YOUR ALL CAPS TEXT HERE"
          />
        </Field>
        <Field label="Converted text">
          <OutputBox value={output} rows={12} />
        </Field>
      </div>

      <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="mb-4 flex justify-end">
          <ResetButton reset={reset} dirty={dirty} />
        </div>
        <div className="flex flex-wrap gap-2">
          {CASE_BUTTONS.map((btn) => (
            <button
              key={btn.key}
              type="button"
              className={btn.key === action ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setAction(btn.key)}
            >
              {btn.label}
            </button>
          ))}
        </div>
        {action === 'title' && (
          <div className="mt-4 max-w-xs">
            <Field label="Style guide for title case" htmlFor="ul-style">
              <Select
                id="ul-style"
                value={styleKey}
                onChange={setStyleKey}
                options={STYLE_GUIDES.filter((g) => g.mode !== 'sentence').map((g) => ({ value: g.key, label: g.name }))}
              />
            </Field>
          </div>
        )}
      </div>
    </ToolShell>
  )
}

/* ================================================================== */
/* Square Your Image                                                   */
/* ================================================================== */

const PRESETS = [
  { value: '1080', label: '1080 × 1080 — Instagram' },
  { value: '1200', label: '1200 × 1200 — general social' },
  { value: '3000', label: '3000 × 3000 — podcast cover' },
  { value: '800', label: '800 × 800 — product listing' },
  { value: '512', label: '512 × 512 — avatar' },
]

export function SquareImage() {
  const [image, setImage] = useState(null)
  const [size, setSize] = useState('1080')
  const [background, setBackground] = useState('#ffffff')
  const [padding, setPadding] = useState(0)
  const [format, setFormat] = useState('image/png')
  const [fileName, setFileName] = useState('square')
  const canvasRef = useRef(null)

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'square')
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setImage(img)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  // Redraw whenever any setting changes.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return
    const dimension = Number(size)
    canvas.width = dimension
    canvas.height = dimension

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = format === 'image/png' && background === 'transparent' ? 'rgba(0,0,0,0)' : background
    ctx.clearRect(0, 0, dimension, dimension)
    if (background !== 'transparent') {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, dimension, dimension)
    }

    const inner = dimension - (dimension * padding) / 100
    const scale = Math.min(inner / image.width, inner / image.height)
    const w = image.width * scale
    const h = image.height * scale
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(image, (dimension - w) / 2, (dimension - h) / 2, w, h)
  }, [image, size, background, padding, format])

  const { dirty, reset } = resetControls([
    [image, setImage, null],
    [size, setSize, '1080'],
    [background, setBackground, '#ffffff'],
    [padding, setPadding, 0],
    [format, setFormat, 'image/png'],
    [fileName, setFileName, 'square'],
  ])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${fileName}-${size}.${format === 'image/png' ? 'png' : 'jpg'}`
    link.href = canvas.toDataURL(format, 0.92)
    link.click()
  }

  return (
    <ToolShell
      path="/tools/square-image"
      howTo={{
        steps: [
          'Choose a photo from your device. It is processed in your browser and never uploaded.',
          'Pick a size, or use one of the ready-made options for Instagram, listings and covers.',
          'Choose a background colour, and add some space around the photo if you want.',
          'Download the square image as PNG or JPEG.',
        ],
      }}
      faqs={[
        {
          q: 'Will my photo get cut?',
          a: 'No. Your photo is fitted inside the square, and the space left over is filled with the background colour you choose. Nothing is cut off. That is the whole point of this tool, because every other square tool crops.',
        },
        {
          q: 'Is my photo uploaded to your server?',
          a: 'No. The file is read on your own device and drawn inside your browser. It never goes over the internet, which is also why even very large photos finish instantly.',
        },
        {
          q: 'Can I get a transparent background?',
          a: 'Yes. Choose Transparent for the background and PNG for the format. JPEG cannot hold transparency, so a transparent background saved as JPEG will come out white.',
        },
        {
          q: 'What size is right for Instagram?',
          a: 'Instagram shows square posts at 1080 × 1080 pixels. Bigger images get shrunk during upload, and smaller ones get stretched and look blurry. The 1080 option is the safe choice.',
        },
      ]}
      about={`
        <h2>Why square, and why not crop</h2>
        <p>Instagram, online marketplaces, podcast apps, app icons and most profile picture boxes all want a square image. Automatic cropping decides for you which part of the photo matters, and it usually decides wrong. Heads get cut off, logos lose an edge, and product photos lose their base. Adding space around the photo keeps the full picture and lets the background do the work.</p>
        <h2>Choosing a background colour</h2>
        <p>White works for product photos and marketplace listings. For social posts, a colour taken from the photo itself works best, because then the extra space looks planned instead of accidental. Transparent is right for logos and icons that will sit on a background you do not control — just remember to save as PNG.</p>
      `}
    >
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <Field label="Image file">
            <label className="btn-secondary w-full cursor-pointer justify-center">
              <Icon.download />
              {image ? 'Choose a different image' : 'Choose an image'}
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </Field>

          <Field label="Output size" htmlFor="si-size">
            <Select id="si-size" value={size} onChange={setSize} options={PRESETS} />
          </Field>

          <Field label="Background" htmlFor="si-bg">
            <div className="flex gap-2">
              <input
                id="si-bg"
                type="color"
                value={background === 'transparent' ? '#ffffff' : background}
                onChange={(e) => setBackground(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-gray-300"
              />
              <button
                type="button"
                className={background === 'transparent' ? 'btn-primary flex-1' : 'btn-secondary flex-1'}
                onClick={() => setBackground(background === 'transparent' ? '#ffffff' : 'transparent')}
              >
                Transparent
              </button>
            </div>
          </Field>

          <Field label={`Padding: ${padding}%`} htmlFor="si-pad">
            <input
              id="si-pad"
              type="range"
              min={0}
              max={40}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
          </Field>

          <Field label="Format" htmlFor="si-format">
            <Select
              id="si-format"
              value={format}
              onChange={setFormat}
              options={[
                { value: 'image/png', label: 'PNG (supports transparency)' },
                { value: 'image/jpeg', label: 'JPEG (smaller file)' },
              ]}
            />
          </Field>

          <button type="button" className="btn-primary w-full" onClick={download} disabled={!image}>
            <Icon.download />
            Download square image
          </button>

          <ResetButton reset={reset} dirty={dirty} className="btn-secondary w-full justify-center" />
        </div>

        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:20px_20px] p-6">
          {image ? (
            <canvas ref={canvasRef} className="max-h-[480px] max-w-full rounded shadow-sm" />
          ) : (
            <p className="text-sm text-ink-500">Choose an image to see the square preview.</p>
          )}
        </div>
      </div>
    </ToolShell>
  )
}
