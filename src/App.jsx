import { Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { ALL_PAGES } from './data/navigation.js'
import { COMPONENTS } from './routes.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function PageFallback() {
  return (
    <div className="container-page py-24">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-brand-600" />
      <p className="mt-4 text-center text-sm text-ink-500">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {ALL_PAGES.map((page) => {
              const Component = COMPONENTS[page.key]
              if (!Component) return null
              return <Route key={page.path} path={page.path} element={<Component slug={page.slug} />} />
            })}
            <Route path="/blog/post/:slug" element={<COMPONENTS.BlogPost />} />
            <Route path="*" element={<COMPONENTS.NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
