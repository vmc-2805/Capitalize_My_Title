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
          Questions about privacy go to <a href="mailto:privacy@capitalizemytitle.com">privacy@capitalizemytitle.com</a>.
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
          Questions about these terms go to <a href="mailto:hello@capitalizemytitle.com">hello@capitalizemytitle.com</a>.
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
