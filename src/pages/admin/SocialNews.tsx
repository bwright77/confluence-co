import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCw, ExternalLink, Send, X, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'
import { getSupabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { areas } from '../../data/areas'
import type { SocialPost } from '../../lib/adminTypes'

type Tab = SocialPost['status']
const TABS: { id: Tab; label: string }[] = [
  { id: 'pending', label: 'To review' },
  { id: 'published', label: 'Published' },
  { id: 'dismissed', label: 'Dismissed' },
]

export default function SocialNews() {
  const { session } = useAuth()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<Tab>('pending')
  const [syncNote, setSyncNote] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'The current · Confluence Colorado admin'
  }, [])

  const { data: posts = [], isLoading } = useQuery<SocialPost[]>({
    queryKey: ['social-posts', tab],
    queryFn: async () => {
      const supabase = await getSupabase()
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('status', tab)
        .order('posted_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })

  const sync = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/social/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token ?? ''}` },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? `Sync failed (${res.status})`)
      return body as { queued: number; remaining: number; errors: string[] }
    },
    onSuccess: (r) => {
      setSyncNote(
        r.queued === 0
          ? 'No new Facebook posts.'
          : `Queued ${r.queued} new post${r.queued === 1 ? '' : 's'}`
            + (r.remaining ? ` — ${r.remaining} more on the next run.` : '.')
            + (r.errors.length ? ` ${r.errors.length} couldn’t be drafted; edit them by hand.` : ''),
      )
      queryClient.invalidateQueries({ queryKey: ['social-posts'] })
    },
    onError: (e: Error) => setSyncNote(e.message),
  })

  return (
    <div className="max-w-5xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-bold text-cc-sage-ink">The current</h1>
          <p className="text-sm text-gray-400">
            New Facebook posts arrive here daily with a drafted news entry. Nothing goes on the site until you publish it.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setSyncNote(null); sync.mutate() }}
          disabled={sync.isPending}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-river/40 disabled:opacity-50"
        >
          <RefreshCw size={15} className={sync.isPending ? 'animate-spin' : ''} />
          {sync.isPending ? 'Checking…' : 'Check Facebook now'}
        </button>
      </div>
      {syncNote && <p className="mb-4 text-sm text-gray-500">{syncNote}</p>}

      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
              tab === t.id ? 'border-cc-sage-ink text-cc-sage-ink' : 'border-transparent text-gray-400 hover:text-navy'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-gray-500">
          {tab === 'pending' ? 'Nothing to review.' : `No ${tab} posts.`}
        </p>
      ) : (
        <ul className="space-y-6">
          {posts.map((p) =>
            p.status === 'pending' ? <ReviewCard key={p.id} post={p} /> : <DoneRow key={p.id} post={p} />,
          )}
        </ul>
      )}
    </div>
  )
}

// ── Pending: editable draft ───────────────────────────────────

function ReviewCard({ post }: { post: SocialPost }) {
  const { session } = useAuth()
  const queryClient = useQueryClient()
  const d = post.draft
  const [title, setTitle] = useState(d?.title ?? '')
  const [slug, setSlug] = useState(d?.slug ?? '')
  const [date, setDate] = useState(post.posted_at.slice(0, 10))
  const [body, setBody] = useState(d?.body ?? post.message ?? '')
  const [imageIndex, setImageIndex] = useState<number | null>(post.images.length ? 0 : null)
  const [alts, setAlts] = useState<string[]>(post.images.map((_, i) => d?.imageAlts[i] ?? ''))
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover')
  const [tags, setTags] = useState<string[]>(d?.tags ?? [])
  const [error, setError] = useState<string | null>(null)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['social-posts'] })

  const publish = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({
          id: post.id, slug, date, title, body, imageIndex,
          imageAlt: imageIndex === null ? '' : alts[imageIndex], imageFit, tags,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `Publish failed (${res.status})`)
    },
    onSuccess: invalidate,
    onError: (e: Error) => setError(e.message),
  })

  const dismiss = useMutation({
    mutationFn: async () => {
      const supabase = await getSupabase()
      const { error } = await supabase
        .from('social_posts')
        .update({ status: 'dismissed', updated_at: new Date().toISOString() })
        .eq('id', post.id)
      if (error) throw error
    },
    onSuccess: invalidate,
    onError: (e: Error) => setError(e.message),
  })

  const toggleTag = (slug: string) =>
    setTags((t) => (t.includes(slug) ? t.filter((x) => x !== slug) : t.length < 3 ? [...t, slug] : t))

  const input = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-navy focus:border-river focus:outline-none'
  const label = 'mb-1 block text-xs font-medium uppercase tracking-[0.07em] text-gray-400'
  const busy = publish.isPending || dismiss.isPending

  return (
    <li className="grid gap-6 rounded-xl border border-gray-200 bg-white p-5 lg:grid-cols-[2fr_3fr]">
      {/* Original post */}
      <div className="min-w-0">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs text-gray-400">
          <span>Facebook · {format(new Date(post.posted_at), 'MMM d, yyyy')}</span>
          {post.permalink && (
            <a href={post.permalink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-river hover:underline">
              Open <ExternalLink size={11} />
            </a>
          )}
        </div>
        <p className="whitespace-pre-line text-sm text-gray-600">{post.message}</p>
        {post.images.length > 0 && (
          <fieldset className="mt-4">
            <legend className={label}>Image</legend>
            <div className="grid grid-cols-2 gap-2">
              {post.images.map((img, i) => (
                <label key={img.path} className={`cursor-pointer overflow-hidden rounded-lg border-2 ${imageIndex === i ? 'border-cc-sage-ink' : 'border-transparent'}`}>
                  <input type="radio" name={`img-${post.id}`} className="sr-only" checked={imageIndex === i} onChange={() => setImageIndex(i)} />
                  <img src={img.url} alt={alts[i] || `Option ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
                </label>
              ))}
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <input type="radio" name={`img-${post.id}`} checked={imageIndex === null} onChange={() => setImageIndex(null)} />
              No image
            </label>
          </fieldset>
        )}
      </div>

      {/* Draft entry */}
      <div className="min-w-0 space-y-4">
        {post.draft_error && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            The automatic draft failed, so this is the original text. Edit it before publishing.
          </p>
        )}
        <div>
          <label className={label} htmlFor={`title-${post.id}`}>Title</label>
          <input id={`title-${post.id}`} className={input} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label className={label} htmlFor={`slug-${post.id}`}>Slug</label>
            <input id={`slug-${post.id}`} className={input} value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor={`date-${post.id}`}>Date</label>
            <input id={`date-${post.id}`} type="date" className={input} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor={`body-${post.id}`}>Body (Markdown)</label>
          <textarea id={`body-${post.id}`} rows={8} className={input} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        {imageIndex !== null && (
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label className={label} htmlFor={`alt-${post.id}`}>Image alt text</label>
              <input
                id={`alt-${post.id}`}
                className={input}
                value={alts[imageIndex]}
                onChange={(e) => setAlts((a) => a.map((v, i) => (i === imageIndex ? e.target.value : v)))}
              />
            </div>
            <div>
              <label className={label} htmlFor={`fit-${post.id}`}>Crop</label>
              <select id={`fit-${post.id}`} className={input} value={imageFit} onChange={(e) => setImageFit(e.target.value as 'cover' | 'contain')}>
                <option value="cover">Fill frame</option>
                <option value="contain">Show whole image</option>
              </select>
            </div>
          </div>
        )}
        <fieldset>
          <legend className={label}>Program areas (up to 3)</legend>
          <div className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <button
                key={a.slug}
                type="button"
                aria-pressed={tags.includes(a.slug)}
                onClick={() => toggleTag(a.slug)}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  tags.includes(a.slug) ? 'border-cc-sage-ink bg-cc-sage-ink text-white' : 'border-gray-200 text-gray-500 hover:border-river/40'
                }`}
              >
                {a.shortName}
              </button>
            ))}
          </div>
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            disabled={busy}
            onClick={() => { setError(null); publish.mutate() }}
            className="flex items-center gap-2 rounded-lg bg-cc-sage-ink px-4 py-2 text-sm font-medium text-white hover:bg-cc-sage-ink/90 disabled:opacity-50"
          >
            <Send size={14} /> {publish.isPending ? 'Publishing…' : 'Publish to site'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => { setError(null); dismiss.mutate() }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-navy disabled:opacity-50"
          >
            <X size={14} /> Dismiss
          </button>
        </div>
      </div>
    </li>
  )
}

// ── Published / dismissed ─────────────────────────────────────

function DoneRow({ post }: { post: SocialPost }) {
  const queryClient = useQueryClient()
  const restore = useMutation({
    mutationFn: async () => {
      const supabase = await getSupabase()
      const { error } = await supabase
        .from('social_posts')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', post.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social-posts'] }),
  })

  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-navy">{post.draft?.title || post.message?.slice(0, 80)}</p>
        <p className="mt-0.5 text-xs text-gray-400">
          Posted {format(new Date(post.posted_at), 'MMM d, yyyy')}
          {post.reviewed_at && ` · published ${format(new Date(post.reviewed_at), 'MMM d')}`}
        </p>
      </div>
      {post.status === 'published' ? (
        <a href="/news" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-xs text-river hover:underline">
          View on site <ExternalLink size={11} />
        </a>
      ) : (
        <button
          type="button"
          onClick={() => restore.mutate()}
          disabled={restore.isPending}
          className="inline-flex shrink-0 items-center gap-1 text-xs text-river hover:underline disabled:opacity-50"
        >
          <RotateCcw size={11} /> Restore
        </button>
      )}
    </li>
  )
}
