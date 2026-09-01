import { Link } from 'react-router-dom'
import { BLOG_CATEGORIES, STATIC_PAGES, TOOL_GROUPS } from '../data/navigation.js'
import { SITE } from '../data/site.js'

const groupItems = (id) => TOOL_GROUPS.find((g) => g.id === id).items

const columns = [
  { title: 'Popular tools', items: TOOL_GROUPS.flatMap((g) => g.items).slice(0, 7) },
  { title: 'Generators', items: groupItems('other-generators').slice(0, 7) },
  { title: 'Names & titles', items: [...groupItems('name-generators'), ...groupItems('title-generators')].slice(0, 7) },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" aria-label={`${SITE.name} home`}>
              <img
                src="/Logo.png"
                alt={SITE.name}
                className="h-12 w-auto object-contain"
                width={240}
                height={48}
              />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-ink-500">
              Free writing tools that run fully inside your browser. Fix the capitals in your titles using nine style
              guides, convert data, find words, and generate the text you are stuck on. Nothing you type is uploaded.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {STATIC_PAGES.filter((p) => p.path !== '/tools' && p.path !== '/blog').map((page) => (
                <li key={page.path}>
                  <Link to={page.path} className="text-ink-500 transition hover:text-brand-600">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="mb-3 text-xs font-bold tracking-wide text-ink-900 uppercase">{column.title}</h2>
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-sm text-ink-500 transition hover:text-brand-600">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="mb-3 text-xs font-bold tracking-wide text-ink-900 uppercase">From the blog</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {BLOG_CATEGORIES.map((cat) => (
              <li key={cat.path}>
                <Link to={cat.path} className="text-sm text-ink-500 transition hover:text-brand-600">
                  {cat.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/tools" className="text-sm font-semibold text-brand-600 hover:underline">
                See every tool →
              </Link>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-xs text-ink-500">
          © {year} {SITE.name}. The style guide rules here are built from the published editions of APA, the Chicago
          Manual of Style, the AP Stylebook, MLA, the Bluebook and the AMA Manual of Style. This site is not connected
          to any of those organisations, or to The New York Times or Wikipedia.
        </p>
      </div>
    </footer>
  )
}
