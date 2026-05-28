import { Link } from 'react-router-dom'
import { newsPosts } from '../../data/news'
import NewsPost from './NewsPost'

interface LatestNewsProps {
  limit?: number
}

export default function LatestNews({ limit = 3 }: LatestNewsProps) {
  const posts = newsPosts.slice(0, limit)
  if (posts.length === 0) return null

  return (
    <section className="bg-cc-warm section-pad" aria-labelledby="latest-news-heading">
      <div className="container-site">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-poster text-cc-orange">
              Field notes
            </p>
            <h2
              id="latest-news-heading"
              className="heading-display mt-2 text-3xl text-cc-navy md:text-4xl"
            >
              The current
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-display text-xs font-semibold uppercase tracking-display">
            <a
              href="https://www.facebook.com/profile.php?id=61573593181872"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cc-sky-ink hover:text-cc-navy"
            >
              Facebook
            </a>
            <span aria-hidden="true" className="text-cc-stone/40">·</span>
            <a
              href="https://www.instagram.com/coloradoconfluence/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cc-sky-ink hover:text-cc-navy"
            >
              Instagram
            </a>
            <span aria-hidden="true" className="text-cc-stone/40">·</span>
            <Link to="/news" className="text-cc-sky-ink hover:text-cc-navy">
              All news →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <NewsPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
