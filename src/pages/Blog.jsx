import { Link, useParams } from 'react-router-dom'
import Seo, { articleSchema, breadcrumbSchema, itemListSchema } from '../components/Seo.jsx'
import { Breadcrumbs, RelatedTools, ShareButtons } from '../components/ui.jsx'
import { BLOG_CATEGORIES, PAGE_BY_PATH, relatedTools } from '../data/navigation.js'
import { POSTS_BY_CATEGORY, POST_BY_SLUG, sortedPosts } from '../data/posts.js'
import { SITE } from '../data/site.js'

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

const categoryLabel = (slug) => BLOG_CATEGORIES.find((c) => c.slug === slug)?.label || slug

function PostCard({ post, showCategory = true }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
        {showCategory && (
          <Link to={`/blog/${post.category}`} className="chip hover:border-brand-400 hover:text-brand-700">
            {categoryLabel(post.category)}
          </Link>
        )}
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>·</span>
        <span>{post.readingTime} min read</span>
      </div>
      <h3 className="mt-2 text-lg leading-snug font-bold text-ink-900">
        <Link to={`/blog/post/${post.slug}`} className="hover:text-brand-700">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-ink-500">{post.excerpt}</p>
      <Link
        to={`/blog/post/${post.slug}`}
        className="mt-3 text-sm font-semibold text-brand-600 hover:underline"
        aria-label={`Read the guide: ${post.title}`}
      >
        Read the guide →
      </Link>
    </article>
  )
}

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
        jsonLd={[breadcrumbSchema(trail), itemListSchema(BLOG_CATEGORIES, 'Blog categories')]}
      />
      <div className="container-page py-8">
        <Breadcrumbs trail={trail} />
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{page.h1}</h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-8 text-ink-700">{page.intro}</p>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Blog categories">
          {BLOG_CATEGORIES.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
            >
              {category.label}
              <span className="ml-1.5 text-ink-500">{POSTS_BY_CATEGORY[category.slug]?.length || 0}</span>
            </Link>
          ))}
        </nav>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

      </div>
    </>
  )
}

/* ================================================================== */

export function BlogCategory({ slug }) {
  const category = BLOG_CATEGORIES.find((c) => c.slug === slug) || BLOG_CATEGORIES[0]
  const posts = POSTS_BY_CATEGORY[category.slug] || []
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: category.label, href: category.path },
  ]

  return (
    <>
      <Seo
        title={category.title}
        description={category.description}
        keywords={category.keywords}
        path={category.path}
        jsonLd={[breadcrumbSchema(trail), itemListSchema(posts.map((p) => ({ label: p.title, path: `/blog/post/${p.slug}` })), category.label)]}
      />
      <div className="container-page py-8">
        <Breadcrumbs trail={trail} />
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{category.h1}</h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-8 text-ink-700">{category.intro}</p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} showCategory={false} />
          ))}
        </div>

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-ink-900">Other categories</h2>
          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORIES.filter((c) => c.slug !== category.slug).map((other) => (
              <Link
                key={other.path}
                to={other.path}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
              >
                {other.label}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}

/* ================================================================== */

export function BlogPost() {
  const { slug } = useParams()
  const post = POST_BY_SLUG.get(slug)

  if (!post) {
    return (
      <div className="container-page py-20 text-center">
        <Seo title="Article not found" description="That article does not exist." path="/blog" noindex />
        <h1 className="text-2xl font-bold text-ink-900">Article not found</h1>
        <p className="mt-2 text-ink-500">The piece you are looking for may have been renamed.</p>
        <Link to="/blog" className="btn-primary mt-6">
          Back to the blog
        </Link>
      </div>
    )
  }

  const category = BLOG_CATEGORIES.find((c) => c.slug === post.category)
  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: category?.label || post.category, href: category?.path || '/blog' },
    { label: post.title, href: `/blog/post/${post.slug}` },
  ]
  const related = sortedPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 2)
  const more = sortedPosts.filter((p) => p.slug !== post.slug && p.category !== post.category).slice(0, 2)

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
            <header className="mb-6">
              <Link to={category?.path || '/blog'} className="chip hover:border-brand-400 hover:text-brand-700">
                {category?.label || post.category}
              </Link>
              <h1 className="mt-3 text-3xl leading-tight font-bold tracking-tight text-ink-900 sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-3 text-[17px] leading-8 text-ink-700">{post.excerpt}</p>
              <p className="mt-4 text-sm text-ink-500">
                Published <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.updated && (
                  <>
                    {' · '}Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                  </>
                )}
                {' · '}
                {post.readingTime} min read
              </p>
            </header>

            <div
              className="prose-basic max-w-none"
              // Post bodies are authored in this repository, not user supplied.
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <ShareButtons url={`${SITE.url}/blog/post/${post.slug}`} title={post.title} />
              <Link to="/blog" className="text-sm font-semibold text-brand-600 hover:underline">
                ← All articles
              </Link>
            </div>

            {(related.length > 0 || more.length > 0) && (
              <section className="mt-12">
                <h2 className="mb-4 text-xl font-bold text-ink-900">Keep reading</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {[...related, ...more].map((other) => (
                    <PostCard key={other.slug} post={other} />
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
