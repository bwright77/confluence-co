import { useEffect } from 'react'
import { newsPosts } from '../data/news'
import NewsPost from '../components/news/NewsPost'

export default function News() {
  useEffect(() => {
    document.title = 'News · Confluence Colorado'
  }, [])

  return (
    <>
      <section className="bg-cc-navy pt-32 pb-10 md:pt-40 md:pb-12">
        <div className="container-site">
          <p className="font-display text-xs font-semibold uppercase tracking-poster text-cc-sky-bright">
            Field notes
          </p>
          <h1 className="heading-display mt-3 text-4xl text-white md:text-5xl md:leading-tight">
            News
          </h1>
          <p className="mt-3 max-w-2xl font-body text-base text-white/85 md:text-lg">
            Short updates from the river, the field, and the work — newest first.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 font-display text-xs font-semibold uppercase tracking-display text-cc-sky-bright">
            <span>Follow along:</span>
            <a
              href="https://www.facebook.com/profile.php?id=61573593181872"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cc-sky/60 px-3 py-1 text-white hover:bg-cc-sky/20"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/coloradoconfluence/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cc-sky/60 px-3 py-1 text-white hover:bg-cc-sky/20"
            >
              Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="section-pad bg-cc-warm">
        <div className="container-site max-w-2xl">
          {newsPosts.length === 0 ? (
            <p className="font-body text-cc-stone">No posts yet — check back soon.</p>
          ) : (
            <div className="space-y-6">
              {newsPosts.map((post) => (
                <NewsPost key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
