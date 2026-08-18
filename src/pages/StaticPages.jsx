import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { breadcrumbSchema, itemListSchema, organizationSchema } from '../components/Seo.jsx'
import { Breadcrumbs, Icon, ToolCard } from '../components/ui.jsx'
import { ALL_TOOLS, PAGE_BY_PATH, TOOL_GROUPS } from '../data/navigation.js'
import { SITE } from '../data/site.js'

/** Shared wrapper for the simple content pages. */
function ContentPage({ path, children, jsonLd = [] }) {
  const page = PAGE_BY_PATH.get(path)
  const trail = [
    { label: 'Home', href: '/' },
    { label: page.label, href: page.path },
  ]

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        keywords={page.keywords}
        path={page.path}
        jsonLd={[breadcrumbSchema(trail), ...jsonLd]}
      />
      <div className="container-page py-8">
        <Breadcrumbs trail={trail} />
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{page.h1}</h1>
          {page.intro && <p className="mt-3 max-w-2xl text-[17px] leading-8 text-ink-700">{page.intro}</p>}
        </header>
        {children}
      </div>
    </>
  )
}

/* ================================================================== */
/* All Tools                                                           */
/* ================================================================== */

export function AllTools() {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const match = (item) =>
      !q ||
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.keywords || []).some((k) => k.includes(q))

    return TOOL_GROUPS.map((group) => ({
      id: group.id,
      label: group.label,
      blurb: group.blurb,
      items: group.items.filter(match),
    })).filter((group) => group.items.length > 0)
  }, [query])

  const total = ALL_TOOLS.length

  return (
    <ContentPage
      path="/tools"
      jsonLd={[itemListSchema(ALL_TOOLS, 'All tools')]}
    >
      <div className="mb-8 max-w-md">
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            <Icon.search />
          </span>
          <input
            type="search"
            className="field pl-9"
            placeholder={`Search ${total} tools…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search tools"
          />
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-ink-500">Nothing matched “{query}”. Try a shorter search.</p>
      ) : (
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <h2 id={`group-${group.id}`} className="text-xl font-bold text-ink-900">
                {group.label}
              </h2>
              <p className="mt-1 mb-4 text-sm text-ink-500">{group.blurb}</p>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <ToolCard tool={item} showGroup={false} clamp={false} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

    </ContentPage>
  )
}

/* ================================================================== */
/* About                                                               */
/* ================================================================== */

export function About() {
  return (
    <ContentPage path="/about" jsonLd={[organizationSchema()]}>
      <div className="prose-basic max-w-3xl">
        <h2>What this site is</h2>
        <p>
          {SITE.name} is a set of free writing tools built around one job that everybody has and nobody
          enjoys: getting the capital letters in a title right. Around that sits a growing set of converters, word
          tools, text generators and name generators. All of them work the same way: no account, no upload, no limit.
        </p>

        <h2>Everything runs in your browser</h2>
        <p>
          There is no server that reads your text. The style guide rules, the CSV reader, the anagram solver and the
          dictionary all run on your own device. Once a page has loaded, the tools keep working even without internet,
          and nothing you paste goes anywhere. This is simply how the site is built. It is not a promise we are asking
          you to trust.
        </p>

        <h2>How the style guides are implemented</h2>
        <p>
          Each of the eight title case guides is written down as a small set of rules: which kinds of words can stay
          small, up to what length, whether “to” before a verb is treated differently, and how joined words are
          handled. All eight then run through the same engine. That is why they behave consistently, and why adding a
          new guide is easy.
        </p>
        <p>
          The rules come from the published editions of APA 7, the Chicago Manual of Style, the AP Stylebook, MLA 9,
          the Bluebook and the AMA Manual of Style, plus the public style notes of The New York Times and Wikipedia.
          Where a guide is genuinely unclear, we follow the most common practice in published work, and we say so in
          the rule list next to the tool.
        </p>

        <h2>Corrections are welcome</h2>
        <p>
          Style guides get updated, and unusual cases get missed. If you find a title our tool gets wrong, send it to
          us with the guide name and the answer you expected. Corrections like these go to the front of the queue,
          because a wrong capital letter defeats the whole purpose of this site.
        </p>

        <h2>How it is funded</h2>
        <p>
          Advertising, and later an optional ad-free membership. Because everything runs in your browser, our hosting
          cost is almost nothing. That is why no tool is behind a payment, and why we have no plan to put one there.
        </p>

        <p>
          <Link to="/contact">Get in touch</Link> · <Link to="/tools">Browse all tools</Link> ·{' '}
          <Link to="/privacy-policy">Privacy policy</Link>
        </p>
      </div>
    </ContentPage>
  )
}

/* ================================================================== */
/* Contact                                                             */
/* ================================================================== */

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: 'Style guide correction', message: '' })
  const [sent, setSent] = useState(false)

  const mailto = `mailto:hello@capitalizemytitle.com?subject=${encodeURIComponent(
    `[${form.topic}] ${form.name || 'Website enquiry'}`,
  )}&body=${encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)}`

  return (
    <ContentPage path="/contact">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              // No form backend is connected, so the message is handed to the
              // user's own mail client rather than posted to a third party.
              window.location.href = mailto
              setSent(true)
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="label">Your name</span>
                <input
                  className="field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>
              <label className="block">
                <span className="label">Email</span>
                <input
                  type="email"
                  className="field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="label">What is this about?</span>
              <select
                className="field"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                <option>Style guide correction</option>
                <option>Bug report</option>
                <option>Tool request</option>
                <option>Advertising</option>
                <option>Something else</option>
              </select>
            </label>

            <label className="block">
              <span className="label">Message</span>
              <textarea
                rows={7}
                className="field"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="If you are reporting a capital letter problem, please include the exact title, the style guide you chose, and the result you expected."
                required
              />
            </label>

            <button type="submit" className="btn-primary">
              Open in your email app
            </button>
            {sent && (
              <p className="text-sm text-emerald-700">
                Your email app should have opened. If it did not, write to{' '}
                <a className="font-semibold underline" href="mailto:hello@capitalizemytitle.com">
                  hello@capitalizemytitle.com
                </a>
                .
              </p>
            )}
            <p className="text-xs text-ink-500">
              This form does not send anything by itself. It only opens a message in your own email app, so nothing is
              sent to any other service.
            </p>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="card p-5">
            <h2 className="text-sm font-bold text-ink-900">Reporting a capitalization bug</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              Give us three things and we can usually fix it the same week: the exact title, the style guide you chose,
              and the result you expected. A line quoted from the guide itself is even better.
            </p>
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-bold text-ink-900">Requesting a tool</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500">
              Tell us what you are doing by hand today, and how often you do it. The tools we build first are the ones
              that replace a boring copy-paste job.
            </p>
          </div>
        </aside>
      </div>
    </ContentPage>
  )
}

/* ================================================================== */
/* Privacy                                                             */
/* ================================================================== */

export function Privacy() {
  return (
    <ContentPage path="/privacy-policy">
      <div className="prose-basic max-w-3xl">
        <p>
          <strong>Last updated:</strong> 14 August 2026
        </p>

        <h2>The short version</h2>
        <p>
          Whatever you type or paste into any tool here is handled inside your browser. It is never sent to us. We
          have no server that receives it, no database that saves it, and no log file that records it.
        </p>

        <h2>What is stored on your device</h2>
        <p>We save a few settings in your browser. All of them stay on your device:</p>
        <ul>
          <li>Your custom dictionary from the title capitalization tool.</li>
          <li>Your switch settings, such as “keep short forms in capitals”.</li>
          <li>Your email address, if you use the newsletter box before we connect a mailing service.</li>
        </ul>
        <p>
          Clearing your browser data removes all of it. Nothing saved there is ever sent anywhere.
        </p>

        <h2>Analytics</h2>
        <p>
          If analytics is switched on for this site, we use Google Analytics with IP addresses hidden, only to count
          page views and see which tools people use. It never receives anything you type. You can block it with any
          ad blocker, and every tool will still work exactly the same.
        </p>

        <h2>Advertising</h2>
        <p>
          Ad spaces on this site may be filled by an outside ad network. That network sets its own cookies and may use
          them to choose which ads you see. Where the law requires it, a consent message controls this. Ad networks
          receive only normal request details such as your IP address, browser and page address. They never receive
          anything you type into a tool.
        </p>

        <h2>Files you open</h2>
        <p>
          The tools that accept a file — the CSV converter and the image squarer — read it using your browser only.
          The file is never uploaded. You can check this yourself: switch off your internet and the tools keep
          working.
        </p>

        <h2>Your rights</h2>
        <p>
          Because we do not collect personal data through the tools, there is usually nothing for us to send you or
          delete. If you have joined our mailing list, you can unsubscribe from any email, or write to us and we will
          remove your address. Under the GDPR, the CCPA and India’s DPDP Act, you have the right to see, correct,
          delete and move your data, and to object to it being used.
        </p>

        <h2>Children</h2>
        <p>
          This site is not made for children under 13, and we do not knowingly collect any personal information from
          them.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes in any important way, the date above will change and we will describe what changed,
          instead of quietly slipping it in.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy go to <a href="mailto:privacy@capitalizemytitle.com">privacy@capitalizemytitle.com</a>{' '}
          or via the <Link to="/contact">contact page</Link>.
        </p>
      </div>
    </ContentPage>
  )
}

/* ================================================================== */
/* Terms                                                               */
/* ================================================================== */

export function Terms() {
  return (
    <ContentPage path="/terms">
      <div className="prose-basic max-w-3xl">
        <p>
          <strong>Last updated:</strong> 14 August 2026
        </p>

        <h2>Using these tools</h2>
        <p>
          Everything on this site is free to use, for personal work and for business work, and you do not have to
          credit us. Whatever you generate — titles, names, dummy text — is yours to use as you like.
        </p>

        <h2>Accuracy of style guide output</h2>
        <p>
          The capitalization rules are built carefully from published style guides. But guides do get updated, and
          some rules are genuinely open to more than one reading. For anything you are submitting for marks or for
          publication, check the result against the edition your college or publisher asks for. We provide these
          tools without any promise that they are correct for your particular purpose.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use automated programs to overload this site or copy it in bulk.</li>
          <li>Republish these tools or their code as your own service.</li>
          <li>Use the invisible character or fancy text tools to pretend to be someone else, avoid moderation, or cheat anyone.</li>
          <li>Use any tool here for anything that is against the law where you live.</li>
        </ul>

        <h2>Third-party names</h2>
        <p>
          APA, the Chicago Manual of Style, the AP Stylebook, MLA, the Bluebook, the AMA Manual of Style, The New York
          Times, Wikipedia, Wordle, Scrabble, Words with Friends and Pokemon are trademarks of their respective
          owners. This site is independent and is not affiliated with, endorsed by or sponsored by any of them. Their
          names are used only to describe what each tool is compatible with.
        </p>

        <h2>Availability</h2>
        <p>
          The site is provided as it is. We cannot promise it will always be available, and tools may be changed or
          removed.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          As far as the law allows, we are not responsible for any indirect loss that comes from using this site,
          including loss caused by depending on something a tool generated or converted.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms go to the <Link to="/contact">contact page</Link>.
        </p>
      </div>
    </ContentPage>
  )
}

/* ================================================================== */
/* 404                                                                 */
/* ================================================================== */

export function NotFound() {
  const suggestions = ALL_TOOLS.slice(0, 6)

  return (
    <>
      <Seo
        title="Page not found"
        description="That page does not exist. Browse all the free writing tools, converters and generators on this site instead."
        path="/404"
        noindex
      />
      <div className="container-page py-20 text-center">
        <p className="text-6xl font-bold text-brand-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Sorry, we could not find that page</h1>
        <p className="mx-auto mt-2 max-w-md text-ink-500">
          It may have been renamed, or it may never have existed. Here are some pages worth trying instead.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            Capitalize a title
          </Link>
          <Link to="/tools" className="btn-secondary">
            Browse all tools
          </Link>
        </div>

        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((tool) => (
            <li key={tool.path}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
