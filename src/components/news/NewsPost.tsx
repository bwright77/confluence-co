import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { areaBySlug } from '../../data/areas'
import { areaColors } from '../programs/areaColors'
import { CCBug } from '../Logo'
import type { NewsPost as NewsPostType } from '../../data/news'

interface NewsPostProps {
  post: NewsPostType
}

function formatRelative(iso: string, today = new Date()): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  const diffDays = Math.round((todayUTC - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.round(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  if (diffDays < 365) {
    const months = Math.round(diffDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatAbsolute(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function NewsPost({ post }: NewsPostProps) {
  return (
    <article className="rounded-lg border border-cc-stone/15 bg-white shadow-sm">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cc-navy">
          <CCBug variant="dark" className="h-7 w-7" />
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-bold text-cc-navy">Confluence Colorado</div>
          <time
            dateTime={post.date}
            title={formatAbsolute(post.date)}
            className="font-body text-xs text-cc-stone"
          >
            {formatRelative(post.date)} · {formatAbsolute(post.date)}
          </time>
        </div>
      </header>

      {/* Body */}
      <div className="px-5 pt-3">
        {post.title && (
          <h2 className="font-display text-lg font-bold text-cc-navy">{post.title}</h2>
        )}
        <div className="news-prose mt-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ node: _n, ...props }) => (
                <p className="mt-2 font-body text-base leading-relaxed text-cc-dark" {...props} />
              ),
              strong: ({ node: _n, ...props }) => (
                <strong className="font-semibold text-cc-navy" {...props} />
              ),
              em: ({ node: _n, ...props }) => <em className="italic" {...props} />,
              a: ({ node: _n, children, ...props }) => (
                <a
                  className="text-cc-sky-ink underline underline-offset-2 hover:text-cc-navy"
                  target={props.href?.startsWith('http') ? '_blank' : undefined}
                  rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                </a>
              ),
              ul: ({ node: _n, ...props }) => (
                <ul className="mt-2 list-disc space-y-1 pl-5 font-body text-cc-dark" {...props} />
              ),
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>
      </div>

      {/* Image */}
      {post.image && (
        <div className="mt-4 border-y border-cc-stone/10 bg-cc-warm">
          {post.imageFit === 'contain' ? (
            <img
              src={post.image}
              alt={post.imageAlt ?? ''}
              loading="lazy"
              className="block h-auto w-full"
            />
          ) : (
            <img
              src={post.image}
              alt={post.imageAlt ?? ''}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]"
            />
          )}
        </div>
      )}

      {/* Footer: tags + link */}
      {(post.tags?.length || post.link) && (
        <footer className={`flex flex-wrap items-center gap-3 px-5 ${post.image ? 'py-3' : 'pb-4 pt-3'}`}>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((slug) => {
                const area = areaBySlug[slug]
                if (!area) return null
                const colors = areaColors(area.colorToken)
                return (
                  <Link
                    key={slug}
                    to={`/program-areas/${area.slug}`}
                    className={`inline-flex items-center rounded-full border bg-white px-2.5 py-0.5 font-display text-[0.65rem] font-semibold uppercase tracking-display ${colors.text} ${colors.border}`}
                  >
                    {area.shortName}
                  </Link>
                )
              })}
            </div>
          )}
          {post.link && (
            <a
              href={post.link.href}
              target={post.link.href.startsWith('http') ? '_blank' : undefined}
              rel={post.link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="ml-auto font-display text-xs font-semibold uppercase tracking-display text-cc-sky-ink hover:text-cc-navy"
            >
              {post.link.label} →
            </a>
          )}
        </footer>
      )}
    </article>
  )
}
