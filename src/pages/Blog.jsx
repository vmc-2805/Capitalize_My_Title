import { Link, useParams } from 'react-router-dom'
import Seo, { articleSchema, breadcrumbSchema, itemListSchema } from '../components/Seo.jsx'
import { Breadcrumbs, RelatedTools, ShareButtons } from '../components/ui.jsx'
import { BLOG_CATEGORIES, PAGE_BY_PATH, relatedTools } from '../data/navigation.js'
import { POST_BY_SLUG, sortedPosts } from '../data/posts.js'
import { SITE } from '../data/site.js'

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

const categoryLabel = (slug) => BLOG_CATEGORIES.find((c) => c.slug === slug)?.label || slug

/* ——— Post card with image ——— */
function PostCard({ post }) {
  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden transition hover:border-brand-400 hover:shadow-lg">
      {/* Image */}
      {post.image && (
        <Link to={`/blog/post/${post.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden>
          <img
            src={post.image}
            alt={post.title}
            className="aspect-[3/2] w-full object-cover transition duration-300 hover:scale-105"
            loading="lazy"
            width={600}
            height={400}
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 border border-brand-100">
            {categoryLabel(post.category)}
          </span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h2 className="mt-3 text-base font-bold leading-snug text-ink-900">
          <Link to={`/blog/post/${post.slug}`} className="hover:text-brand-600 transition">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-ink-500 line-clamp-3">{post.excerpt}</p>
        <Link
          to={`/blog/post/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline"
          aria-label={`Read: ${post.title}`}
        >
          Read article →
        </Link>
      </div>
    </article>
  )
}

/* ================================================================== */
/* Blog Index — all posts, no category filter                          */
/* ================================================================== */

export function BlogIndex() {
  const page = PAGE_BY_PATH.get('/blog')
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
  ]

  return (
    <>
      <Seo
        title={page.title}
        description={page.description}
        keywords={page.keywords}
        path="/blog"
        jsonLd={[breadcrumbSchema(trail), itemListSchema(sortedPosts.map((p) => ({ label: p.title, path: `/blog/post/${p.slug}` })), 'All articles')]}
      />
      <div className="container-page py-10">
        <Breadcrumbs trail={trail} />
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{page.h1}</h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-8 text-ink-700">{page.intro}</p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}

/* ================================================================== */
/* BlogCategory — redirect to /blog (kept for backward compat)         */
/* ================================================================== */

export function BlogCategory({ slug }) {
  // Category pages now just show all posts, redirecting user to /blog
  return <BlogIndex />
}

/* ================================================================== */
/* Blog Post detail page                                               */
/* ================================================================== */

export function BlogPost() {
  const { slug } = useParams()
  const post = POST_BY_SLUG.get(slug)

  if (!post) {
    return (
      <div className="container-page py-20 text-center">
        <Seo title="Article not found" description="That article does not exist." path="/blog" noindex />
        <h1 className="text-2xl font-bold text-ink-900">Article not found</h1>
        <p className="mt-2 text-ink-500">The article you are looking for may have moved.</p>
        <Link to="/blog" className="btn-primary mt-6 inline-flex">
          ← Back to blog
        </Link>
      </div>
    )
  }

  const category = BLOG_CATEGORIES.find((c) => c.slug === post.category)
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/post/${post.slug}` },
  ]

  const related = sortedPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        keywords={post.keywords}
        path={`/blog/post/${post.slug}`}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.updated || post.date}
        jsonLd={[articleSchema(post), breadcrumbSchema(trail)]}
      />

      <div className="container-page py-8">
        <Breadcrumbs trail={trail} />

        <div className="mx-auto max-w-3xl">
          <article className="min-w-0">
            {/* Header */}
            <header className="mb-8 border-b border-gray-200 pb-6">
              <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 border border-brand-100">
                {category?.label || post.category}
              </span>
              <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-ink-900 sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-3 text-[17px] leading-8 text-ink-500">{post.excerpt}</p>
              <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.updated && (
                  <>
                    <span>·</span>
                    <span>Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time></span>
                  </>
                )}
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </p>
            </header>

            {/* Body */}
            <div
              className="prose-basic max-w-none"
              // Post bodies are authored in this repository, not user input.
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {/* Footer actions */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <ShareButtons url={`${SITE.url}/blog/post/${post.slug}`} title={post.title} />
              <Link to="/blog" className="text-sm font-semibold text-brand-600 hover:underline">
                ← All articles
              </Link>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-5 text-xl font-bold text-ink-900">More articles</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {related.map((other) => (
                    <article key={other.slug} className="rounded-lg border border-gray-200 p-4 transition hover:border-brand-400 hover:shadow-sm">
                      <span className="text-xs font-semibold text-brand-600">{categoryLabel(other.category)}</span>
                      <h3 className="mt-1 text-sm font-bold text-ink-900 leading-snug">
                        <Link to={`/blog/post/${other.slug}`} className="hover:text-brand-600">
                          {other.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-xs text-ink-500">{other.readingTime} min read</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <RelatedTools tools={relatedTools('/', 4)} title="Free tools that go with this guide" />
          </article>
        </div>
      </div>
    </>
  )
}
