import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { newSeed } from '../lib/random.js'

/* ------------------------------------------------------------------ */
/* Icons — inline so nothing is fetched at runtime                     */
/* ------------------------------------------------------------------ */

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const Icon = {
  copy: (p) => (
    <svg {...iconProps} {...p}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  check: (p) => (
    <svg {...iconProps} {...p}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  ),
  download: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  ),
  refresh: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  ),
  // A ring with one bright quarter — the gap is what reads as motion once the
  // whole thing spins.
  spinner: (p) => (
    <svg {...iconProps} {...p} className={`animate-spin ${p?.className || ''}`}>
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  ),
  trash: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </svg>
  ),
  chevronRight: (p) => (
    <svg {...iconProps} {...p}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  chevronDown: (p) => (
    <svg {...iconProps} {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  arrowRight: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  tool: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.5 2.5-1.4-1.4 2.5-2.5Z" />
    </svg>
  ),
  search: (p) => (
    <svg {...iconProps} {...p}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  menu: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  close: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  shuffle: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  ),
  print: (p) => (
    <svg {...iconProps} {...p}>
      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </svg>
  ),
}

/* ------------------------------------------------------------------ */
/* Copy to clipboard                                                   */
/* ------------------------------------------------------------------ */

export function useCopy(resetAfter = 1800) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text) => {
      if (!text) return false
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        // Clipboard API is unavailable over http or when permission is denied.
        const area = document.createElement('textarea')
        area.value = text
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        document.execCommand('copy')
        document.body.removeChild(area)
      }
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), resetAfter)
      return true
    },
    [resetAfter],
  )

  return { copied, copy }
}

export function CopyButton({ value, label = 'Copy', className = 'btn-secondary', disabled }) {
  const { copied, copy } = useCopy()
  return (
    <button
      type="button"
      className={className}
      onClick={() => copy(value)}
      disabled={disabled || !value}
      aria-live="polite"
    >
      {copied ? <Icon.check /> : <Icon.copy />}
      {copied ? 'Copied' : label}
    </button>
  )
}

/**
 * Builds the reset behaviour for a tool from a list of its controls.
 *
 * Each field is `[value, setter, initialValue]`. Listing them in one place
 * means a new control is obviously missing from the reset if it is not here,
 * which is the failure mode a hand-written reset function always hits.
 */
export function resetControls(fields) {
  return {
    dirty: fields.some(([value, , initial]) => !Object.is(value, initial)),
    reset: () => fields.forEach(([, set, initial]) => set(initial)),
  }
}

/**
 * Seed state for tools that must stay empty until the button is pressed.
 *
 * A seed of 0 means "nothing generated yet". Keeping that in the seed itself,
 * rather than in a second `hasGenerated` flag, means the two can never disagree
 * — and Reset is already a matter of putting the seed back to 0.
 */
export function useGenerator(initial = 0) {
  const [seed, setSeed] = useState(initial)
  return {
    seed,
    generated: seed !== 0,
    generate: () => setSeed(newSeed()),
    setSeed,
    field: [seed, setSeed, initial],
  }
}

/** Shown in place of results before the first press, and after a reset. */
export function EmptyState({ children, icon = true }) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-10 text-center">
      {icon && (
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm ring-1 ring-gray-200">
          <Icon.refresh />
        </div>
      )}
      <p className="text-[15px] font-semibold text-ink-800">{children}</p>
    </div>
  )
}

/**
 * Shown while a result is being written.
 *
 * The skeleton rows matter as much as the spinner: they hold the height the
 * results will take, so the page does not jump when the answer lands, and they
 * say "a list is coming" rather than only "something is happening". `rows` is
 * capped because a hundred grey bars is noise, not information.
 */
export function LoadingState({ children = 'Working…', rows = 4 }) {
  return (
    <div className="mt-6" role="status" aria-live="polite">
      <div className="flex items-center justify-center gap-2.5 py-4 text-[15px] font-semibold text-ink-700">
        <Icon.spinner className="text-brand-600" />
        {children}
      </div>
      <div className="space-y-3" aria-hidden="true">
        {Array.from({ length: Math.min(rows, 6) }, (_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="h-3.5 animate-pulse rounded bg-gray-200" style={{ width: `${92 - i * 9}%` }} />
            <div
              className="mt-2.5 h-3.5 animate-pulse rounded bg-gray-100"
              style={{ width: `${70 - i * 7}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/** The count-and-actions row that sits above a list of generated results. */
export function ResultsHeader({ count, noun, children }) {
  return (
    <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
      <h2 className="text-sm font-bold text-ink-900">
        {count} {noun}
        {count === 1 ? '' : 's'}
      </h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

/** The Reset button every tool shares. Disabled while there is nothing to undo. */
export function ResetButton({ reset, dirty, className = 'btn-secondary', label = 'Reset' }) {
  return (
    <button
      type="button"
      className={className}
      onClick={reset}
      disabled={!dirty}
      title="Clear everything on this tool and start again"
    >
      <Icon.trash />
      {label}
    </button>
  )
}

export function DownloadButton({
  value,
  filename,
  mime = 'text/plain',
  label = 'Download',
  disabled,
  className = 'btn-secondary',
}) {
  const onClick = () => {
    const blob = new Blob([value], { type: `${mime};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return (
    <button type="button" className={className} onClick={onClick} disabled={disabled || !value}>
      <Icon.download />
      {label}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Form primitives                                                     */
/* ------------------------------------------------------------------ */

export function Field({ label, hint, children, htmlFor }) {
  return (
    <div>
      {label && (
        <label className="label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  )
}

export function Select({ value, onChange, options, id, className = '' }) {
  return (
    <select id={id} className={`field ${className}`} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value
        const text = typeof opt === 'string' ? opt : opt.label
        return (
          <option key={val} value={val}>
            {text}
          </option>
        )
      })}
    </select>
  )
}

export function NumberInput({ value, onChange, min = 1, max = 999, id, className = '' }) {
  return (
    <input
      id={id}
      type="number"
      className={`field ${className}`}
      value={value}
      min={min}
      max={max}
      onChange={(e) => {
        const n = Number(e.target.value)
        onChange(Number.isNaN(n) ? min : Math.min(max, Math.max(min, n)))
      }}
    />
  )
}

/**
 * A row of joined buttons for a small set of choices.
 *
 * Radio inputs rather than buttons, so arrow keys move between the options and
 * a screen reader announces "2 of 4" — a row of plain buttons gives neither.
 * The input itself is hidden and the label carries the styling.
 */
export function SegmentedControl({ name, value, onChange, options }) {
  return (
    <div className="inline-flex flex-wrap overflow-hidden rounded-md border border-gray-300" role="radiogroup">
      {options.map((option, i) => {
        const active = option.value === value
        return (
          <label
            key={option.value}
            className={`cursor-pointer px-4 py-2 text-sm font-semibold transition select-none ${
              i > 0 ? 'border-l border-gray-300' : ''
            } ${
              active
                ? 'bg-brand-600 text-white'
                : 'bg-white text-ink-600 hover:bg-gray-50 hover:text-ink-900'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        )
      })}
    </div>
  )
}

export function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-brand-600 focus:ring-brand-500"
      />
      <span>
        <span className="text-sm font-medium text-ink-700">{label}</span>
        {hint && <span className="block text-xs text-ink-500">{hint}</span>}
      </span>
    </label>
  )
}

export function Tabs({ tabs, active, onChange, size = 'md' }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            title={tab.title}
            onClick={() => onChange(tab.key)}
            className={`-mb-px cursor-pointer rounded-t-md border-b-2 font-semibold transition ${
              size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
            } ${
              isActive
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-transparent text-ink-500 hover:bg-gray-50 hover:text-ink-900'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Output surfaces                                                     */
/* ------------------------------------------------------------------ */

export function OutputBox({ value, placeholder = 'Your result appears here.', rows = 6, mono = false, actions }) {
  return (
    <div>
      <div
        className={`min-h-[${rows * 24}px] w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm whitespace-pre-wrap break-words ${
          mono ? 'font-mono text-[13px]' : ''
        } ${value ? 'text-ink-900' : 'text-gray-400'}`}
        style={{ minHeight: rows * 24 }}
      >
        {value || placeholder}
      </div>
      {actions !== false && (
        <div className="mt-2 flex flex-wrap gap-2">
          <CopyButton value={value} />
          <DownloadButton value={value} filename="output.txt" />
        </div>
      )}
    </div>
  )
}

export function StatGrid({ stats }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">
          <dt className="text-xs font-medium tracking-wide text-ink-500 uppercase">{stat.label}</dt>
          <dd className="mt-0.5 text-lg font-bold text-ink-900 tabular-nums">{stat.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Callout({ title, children, tone = 'info' }) {
  const tones = {
    info: 'border-brand-200 bg-brand-50 text-brand-900',
    warn: 'border-amber-200 bg-amber-50 text-amber-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  }
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}>
      {title && <p className="mb-1 font-bold">{title}</p>}
      <div className="leading-6">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page furniture                                                      */
/* ------------------------------------------------------------------ */

export function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-500">
        {trail.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1">
            {i > 0 && <Icon.chevronRight width={12} height={12} className="text-gray-300" />}
            {i === trail.length - 1 ? (
              <span className="font-medium text-ink-700">{crumb.label}</span>
            ) : (
              <Link to={crumb.href} className="hover:text-brand-600 hover:underline">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function FaqSection({ faqs, title = 'Frequently asked questions' }) {
  if (!faqs?.length) return null
  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-4 text-xl font-bold text-ink-900">
        {title}
      </h2>
      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {faqs.map((faq) => (
          <details key={faq.q} className="group px-4 py-3.5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink-900">
              {faq.q}
              <Icon.chevronDown className="shrink-0 text-ink-500 transition group-open:rotate-180" />
            </summary>
            <p className="mt-2.5 text-[15px] leading-7 text-ink-700">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/**
 * One tool card. Shared by the related-tools strip, the All Tools index and
 * the 404 page so a tool link looks the same everywhere on the site.
 *
 * The plain bordered card this used to be did not read as clickable, so it now
 * puts the name in link colour and ends with an explicit "Open this tool"
 * button rather than leaving the reader to guess.
 */
export function ToolCard({ tool, showGroup = true, clamp = true }) {
  return (
    <Link
      to={tool.path}
      className="group flex h-full flex-col rounded-md border border-brand-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      {showGroup && tool.group && (
        <span className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.06em] text-brand-700 uppercase">
          <Icon.tool width={12} height={12} />
          {tool.group}
        </span>
      )}
      <span className={`text-[15px] leading-snug font-bold text-brand-800 group-hover:underline ${showGroup ? 'mt-1.5' : ''}`}>
        {tool.label}
      </span>
      {tool.description && (
        <span className={`mt-1 flex-1 text-xs leading-5 text-ink-500 ${clamp ? 'line-clamp-2' : ''}`}>
          {tool.description}
        </span>
      )}
      <span className="mt-3 flex">
        <span className="inline-flex items-center gap-1 rounded bg-brand-600 px-2 py-1 text-xs font-semibold text-white transition group-hover:bg-brand-700">
          Open this tool
          <Icon.arrowRight width={13} height={13} className="transition group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  )
}

/** A grid of links to other tools, shown at the foot of every tool page. */
export function RelatedTools({ tools, title = 'More free tools you can open' }) {
  if (!tools?.length) return null

  return (
    <section
      className="mt-12 rounded-lg border border-brand-200 bg-brand-50/60 p-5 sm:p-6"
      aria-labelledby="related-heading"
    >
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="related-heading" className="text-xl font-bold text-ink-900">
          {title}
        </h2>
        <Link to="/tools" className="text-sm font-semibold text-brand-700 hover:underline">
          See all tools →
        </Link>
      </div>
      <p className="mb-4 text-sm text-ink-700">Click any card below to open that tool. All of them are free.</p>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <li key={tool.path}>
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ShareButtons({ url, title }) {
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)
  const links = [
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { label: 'Reddit', href: `https://reddit.com/submit?url=${encoded}&title=${text}` },
    { label: 'Email', href: `mailto:?subject=${text}&body=${encoded}` },
  ]
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Share</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:border-brand-400 hover:text-brand-700"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}


/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

/** State that survives a reload, used for custom dictionaries and preferences. */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : JSON.parse(raw)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* private mode or storage full — the value still works for this session */
    }
  }, [key, value])

  return [value, setValue]
}
