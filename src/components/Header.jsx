import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { TOOL_GROUPS } from '../data/navigation.js'
import { SITE } from '../data/site.js'
import { Icon } from './ui.jsx'

function Logo() {
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      aria-label={`${SITE.name} home`}
    >
      <img
        src="/Logo.png"
        alt={SITE.name}
        className="h-14 w-auto object-contain"
        width={280}
        height={56}
      />
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop: Tools mega menu with per-group flyout panels               */
/* ------------------------------------------------------------------ */

function ToolsMenu({ open, onClose }) {
  const [activeGroup, setActiveGroup] = useState(TOOL_GROUPS[0].id)
  const group = TOOL_GROUPS.find((g) => g.id === activeGroup) || TOOL_GROUPS[0]

  if (!open) return null

  return (
    <div className="absolute top-full left-0 z-50 pt-2">
      <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
        <ul className="w-60 shrink-0 border-r border-gray-100 py-2">
          {TOOL_GROUPS.map((g) => {
            const isActive = g.id === activeGroup
            const single = g.items.length === 1
            return (
              <li key={g.id}>
                {single ? (
                  <Link
                    to={g.items[0].path}
                    onClick={onClose}
                    onMouseEnter={() => setActiveGroup(g.id)}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm transition ${
                      isActive ? 'bg-brand-50 font-semibold text-brand-700' : 'text-ink-700 hover:bg-gray-50'
                    }`}
                  >
                    {g.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onMouseEnter={() => setActiveGroup(g.id)}
                    onFocus={() => setActiveGroup(g.id)}
                    onClick={() => setActiveGroup(g.id)}
                    aria-expanded={isActive}
                    className={`flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                      isActive ? 'bg-brand-50 font-semibold text-brand-700' : 'text-ink-700 hover:bg-gray-50'
                    }`}
                  >
                    {g.label}
                    <Icon.chevronRight width={14} height={14} className="text-gray-400" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        <div className="w-80 p-4">
          <p className="mb-1 text-xs font-bold tracking-wide text-brand-600 uppercase">{group.label}</p>
          <p className="mb-3 text-xs leading-5 text-ink-500">{group.blurb}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className="block rounded-md px-2.5 py-2 text-sm text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function SimpleMenu({ open, items, onClose, width = 'w-72' }) {
  if (!open) return null
  return (
    <div className="absolute top-full left-0 z-50 pt-2">
      <ul className={`${width} max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white py-2 shadow-xl`}>
        {items.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={onClose}
              className="block px-4 py-2 text-sm text-ink-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile accordion                                                    */
/* ------------------------------------------------------------------ */

function MobileNav({ open, onClose }) {
  const [section, setSection] = useState(null)
  if (!open) return null

  const toggle = (id) => setSection((s) => (s === id ? null : id))

  return (
    <div className="border-t border-gray-200 bg-white lg:hidden">
      <nav className="container-page max-h-[75vh] overflow-y-auto py-3">
        {TOOL_GROUPS.map((group) => (
          <div key={group.id} className="border-b border-gray-100">
            <button
              type="button"
              onClick={() => toggle(group.id)}
              aria-expanded={section === group.id}
              className="flex w-full cursor-pointer items-center justify-between py-3 text-left text-sm font-semibold text-ink-900"
            >
              {group.label}
              <Icon.chevronDown className={`transition ${section === group.id ? 'rotate-180' : ''}`} />
            </button>
            {section === group.id && (
              <ul className="pb-2">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className="block py-2 pl-3 text-sm text-ink-700 hover:text-brand-700"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div key="blog" className="border-b border-gray-100">
            <Link
              to="/blog"
              onClick={onClose}
              className="flex w-full items-center py-3 text-left text-sm font-semibold text-ink-900 hover:text-brand-600"
            >
              Blog
            </Link>
          </div>

        <Link to="/tools" onClick={onClose} className="btn-primary mt-4 w-full">
          Browse all tools
        </Link>
      </nav>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)
  const location = useLocation()

  // Any navigation closes everything.
  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  // Hover opens the menu on desktop, but a click on an already-hovered button
  // must not immediately close it again — so we remember how it was opened.
  const openedByHover = useRef(false)

  const handleClick = (id) => {
    if (openMenu === id && !openedByHover.current) {
      setOpenMenu(null)
      return
    }
    openedByHover.current = false
    setOpenMenu(id)
  }

  // Highlighting the section you are in is the cheapest way to stop a header
  // feeling like decoration.
  const isToolsSection = location.pathname === '/tools' || location.pathname.startsWith('/tools/')
  const isBlogSection = location.pathname.startsWith('/blog')
  const onHome = location.pathname === '/'

  const menuButton = (id, label, active) => (
    <div
      className="relative h-full"
      onMouseEnter={() => {
        openedByHover.current = true
        setOpenMenu(id)
      }}
      onMouseLeave={() => setOpenMenu((m) => (m === id ? null : m))}
    >
      <button
        type="button"
        aria-expanded={openMenu === id}
        aria-haspopup="true"
        onClick={() => handleClick(id)}
        className={`flex h-full cursor-pointer items-center gap-1 border-b-2 px-3 text-[13px] font-bold tracking-[0.06em] uppercase transition ${
          openMenu === id || active
            ? 'border-brand-600 text-brand-700'
            : 'border-transparent text-ink-700 hover:text-brand-700'
        }`}
      >
        {label}
        <Icon.chevronDown
          width={13}
          height={13}
          className={`transition ${openMenu === id ? 'rotate-180' : ''}`}
        />
      </button>
      {id === 'tools' && <ToolsMenu open={openMenu === 'tools'} onClose={() => setOpenMenu(null)} />}
      {id === 'blog' && (
        <SimpleMenu open={openMenu === 'blog'} items={BLOG_CATEGORIES} onClose={() => setOpenMenu(null)} width="w-64" />
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex h-full items-center gap-7">
          <Logo />
          <nav ref={navRef} className="hidden h-full items-center lg:flex" aria-label="Main">
            {menuButton('tools', 'Tools', isToolsSection)}
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `flex h-full items-center border-b-2 px-3 text-[13px] font-bold tracking-[0.06em] uppercase transition ${
                  isActive || isBlogSection ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-700 hover:text-brand-700'
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/tools"
              className={({ isActive }) =>
                `flex h-full items-center border-b-2 px-3 text-[13px] font-bold tracking-[0.06em] uppercase transition ${
                  isActive ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-700 hover:text-brand-700'
                }`
              }
            >
              All tools
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* On the homepage the title tool is already open, so pointing the
              button back at "/" would be a dead link. Swap it there. */}
          {onHome ? (
            <Link to="/tools" className="btn-primary hidden sm:inline-flex">
              Browse all tools
            </Link>
          ) : (
            <Link to="/" className="btn-primary hidden sm:inline-flex">
              Capitalize a title
            </Link>
          )}
          <button
            type="button"
            className="btn-ghost -mr-2 lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <Icon.close width={22} height={22} /> : <Icon.menu width={22} height={22} />}
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  )
}
