import { SITE } from '../data/site.js'
import { PAGE_BY_PATH, relatedTools } from '../data/navigation.js'
import Seo, { breadcrumbSchema, faqSchema, softwareSchema } from './Seo.jsx'
import { Breadcrumbs, FaqSection, RelatedTools, ShareButtons } from './ui.jsx'

/**
 * The steps sit directly above the tool rather than at the bottom of the page,
 * because someone who has just landed here needs them before they touch a
 * control, not after they have already given up.
 */
function HowToPanel({ steps, title }) {
  if (!steps?.length) return null

  return (
    <section className="mb-6 rounded-md border border-gray-200 bg-white" aria-labelledby="howto-heading">
      <h2
        id="howto-heading"
        className="border-b border-gray-200 px-4 py-2.5 text-xs font-bold tracking-[0.08em] text-ink-500 uppercase"
      >
        {title}
      </h2>
      <ol className="grid gap-x-8 gap-y-3 p-4 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <span
              className="text-sm leading-6 text-ink-700"
              dangerouslySetInnerHTML={{ __html: step }}
            />
          </li>
        ))}
      </ol>
    </section>
  )
}

/**
 * Wraps every tool page: SEO tags, structured data, breadcrumbs, the steps,
 * the tool itself, then the supporting content underneath.
 */
export default function ToolShell({ path, children, faqs = [], howTo, about, breadcrumbTrail }) {
  const page = PAGE_BY_PATH.get(path)
  if (!page) throw new Error(`No page registered for ${path}`)

  const trail = breadcrumbTrail || [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: page.label, href: page.path },
  ]

  const jsonLd = [softwareSchema(page), breadcrumbSchema(trail)]
  if (faqs.length) jsonLd.push(faqSchema(faqs))

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        keywords={page.keywords}
        path={page.path}
        jsonLd={jsonLd}
      />

      <div className="container-tool py-8">
        <Breadcrumbs trail={trail} />

        <header className="mb-6 border-b border-gray-200 pb-6">
          <h1 className="text-[28px] leading-tight font-bold tracking-tight text-ink-900 sm:text-[34px]">
            {page.h1}
          </h1>
          {page.intro && (
            <p
              className="mt-2.5 max-w-3xl text-base leading-7 text-ink-700"
              // Intro copy lives in our own page registry and may contain <code>.
              dangerouslySetInnerHTML={{ __html: page.intro }}
            />
          )}
        </header>

        <HowToPanel steps={howTo?.steps} title={howTo?.title || 'How to use this tool'} />

        {children}

        {about && (
          <section
            className="prose-basic mt-14 max-w-3xl border-t border-gray-200 pt-8"
            aria-label="About this tool"
            // Long-form copy authored per tool in this repository.
            dangerouslySetInnerHTML={{ __html: about }}
          />
        )}

        <FaqSection faqs={faqs} />
        <RelatedTools tools={relatedTools(page.path)} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
          <ShareButtons url={`${SITE.url}${page.path}`} title={page.h1} />
          <p className="text-xs text-ink-500">Free · No signup · Runs in your browser</p>
        </div>
      </div>
    </>
  )
}
