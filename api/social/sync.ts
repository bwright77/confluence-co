import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'
import yaml from 'js-yaml'
import {
  supabase, IMAGE_BUCKET, NEWS_PATH, AREAS_PATH,
  missingEnv, adminUserId, isCron, readRepoFile,
} from './_shared'

// Pulls new Facebook Page posts into the social_posts review queue, each with a
// Claude-drafted news entry. Nothing here touches the public site — an admin
// publishes from /admin/news (api/social/publish).
//
//   GET  Authorization: Bearer <CRON_SECRET>  → Vercel Cron (daily)
//   POST Authorization: Bearer <admin JWT>    → "Check Facebook now" button

export const config = { maxDuration: 300 }

// Each post is one Claude call (~10–30s with images); the rest wait for the
// next run.
const MAX_PER_RUN = 5
const MAX_IMAGES = 4
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // Claude's per-image limit
const GRAPH = `https://graph.facebook.com/${process.env.FB_GRAPH_VERSION || 'v23.0'}`

const anthropic = new Anthropic()

// ── Facebook ──────────────────────────────────────────────────

interface FbMedia { image?: { src: string } }
interface FbAttachment {
  media_type?: string
  media?: FbMedia
  subattachments?: { data: FbAttachment[] }
}
interface FbPost {
  id: string
  message?: string
  created_time: string
  permalink_url?: string
  full_picture?: string
  attachments?: { data: FbAttachment[] }
}

async function fetchPagePosts(sinceUnix: number): Promise<FbPost[]> {
  const params = new URLSearchParams({
    fields: 'id,message,created_time,permalink_url,full_picture,'
      + 'attachments{media_type,media,subattachments{media_type,media}}',
    since: String(sinceUnix),
    limit: '25',
    access_token: process.env.FB_PAGE_TOKEN!,
  })
  const res = await fetch(`${GRAPH}/${process.env.FB_PAGE_ID}/posts?${params}`)
  const body = await res.json() as { data?: FbPost[]; error?: { message: string } }
  if (!res.ok || !body.data) {
    throw new Error(`Facebook API ${res.status}: ${body.error?.message ?? 'no data'}`)
  }
  return body.data
}

function imageUrls(post: FbPost): string[] {
  const urls: string[] = []
  for (const a of post.attachments?.data ?? []) {
    const items = a.subattachments?.data ?? [a]
    for (const item of items) {
      if (item.media_type === 'photo' && item.media?.image?.src) urls.push(item.media.image.src)
    }
  }
  if (urls.length === 0 && post.full_picture) urls.push(post.full_picture)
  return urls.slice(0, MAX_IMAGES)
}

// ── Images: copy off Facebook's expiring CDN into Supabase Storage ──

type ImageMime = 'image/jpeg' | 'image/png' | 'image/webp'
const EXT: Record<ImageMime, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

interface StoredImage { path: string; url: string; mime: ImageMime; bytes: Buffer }

async function storeImages(postId: string, urls: string[]): Promise<StoredImage[]> {
  const stored: StoredImage[] = []
  for (const [i, src] of urls.entries()) {
    const res = await fetch(src)
    const mime = res.headers.get('content-type')?.split(';')[0] as ImageMime
    if (!res.ok || !(mime in EXT)) continue
    const bytes = Buffer.from(await res.arrayBuffer())
    const path = `facebook/${postId}/${i}.${EXT[mime]}`
    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, bytes, { contentType: mime, upsert: true })
    if (error) throw new Error(`Storage upload failed: ${error.message}`)
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
    stored.push({ path, url: data.publicUrl, mime, bytes })
  }
  return stored
}

// ── Drafting ──────────────────────────────────────────────────

const DraftSchema = z.object({
  title: z.string(),
  slug: z.string(),
  body: z.string(),
  imageAlts: z.array(z.string()),
  tags: z.array(z.string()),
})
type Draft = z.infer<typeof DraftSchema>

const SYSTEM_PROMPT = `You turn Confluence Colorado's Facebook posts into entries for "The current," \
the news feed on confluenceco.org. Confluence Colorado is a Denver nonprofit connecting youth and \
communities to land, water, and each other.

Keep the author's own words. Staff have reverted past rewrites, so the body should be the original \
post with only light cleanup: fix clear typos, drop hashtags, @-mentions syntax, emoji, and "link in \
bio" style calls to action, and add **bold** to at most two or three key names or phrases. Do not \
add facts, quotes, numbers, or claims that are not in the post. Split into short paragraphs only \
where the original already changes topic. The body is Markdown.

Also write:
- title: a short headline in sentence case (no trailing period), drawn from the post itself.
- slug: lowercase-hyphenated, 3–7 words, ending in the four-digit year of the post date.
- imageAlts: one alt text per attached image, in the order given — describe what is visible in a \
single plain sentence, under 25 words, without "image of" or "photo of".
- tags: one to three program-area slugs from the provided list that the post genuinely relates \
to; never invent a slug.`

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

async function draftEntry(
  post: FbPost, images: StoredImage[], areas: { slug: string; name: string }[],
  examples: string, takenSlugs: Set<string>,
): Promise<{ draft: Draft; tokens: number }> {
  const date = post.created_time.slice(0, 10)
  const content: Anthropic.Beta.BetaContentBlockParam[] = []
  for (const img of images) {
    if (img.bytes.length > MAX_IMAGE_BYTES) continue
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: img.mime, data: img.bytes.toString('base64') },
    })
  }
  content.push({
    type: 'text',
    text: [
      `Program-area slugs:\n${areas.map((a) => `- ${a.slug} (${a.name})`).join('\n')}`,
      `Recent published entries, for tone and length:\n${examples}`,
      `Post date: ${date}`,
      `Attached images: ${images.length}`,
      `Facebook post:\n<post>\n${post.message}\n</post>`,
    ].join('\n\n'),
  })

  const response = await anthropic.beta.messages.parse({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
    output_config: { effort: 'low', format: betaZodOutputFormat(DraftSchema) },
  })
  if (response.stop_reason === 'refusal' || !response.parsed_output) {
    throw new Error(`Draft failed (stop_reason: ${response.stop_reason})`)
  }
  const raw = response.parsed_output

  // Normalize whatever came back so the review form starts valid.
  const validTags = new Set(areas.map((a) => a.slug))
  let slug = slugify(raw.slug) || slugify(raw.title) || `facebook-${post.id}`
  if (!slug.endsWith(date.slice(0, 4))) slug = `${slug}-${date.slice(0, 4)}`
  for (let n = 2, base = slug; takenSlugs.has(slug); n++) slug = `${base}-${n}`
  takenSlugs.add(slug)

  return {
    draft: {
      title: raw.title.trim(),
      slug,
      body: raw.body.trim(),
      imageAlts: images.map((_, i) => raw.imageAlts[i]?.trim() ?? ''),
      tags: raw.tags.filter((t) => validTags.has(t)).slice(0, 3),
    },
    tokens: response.usage.input_tokens + response.usage.output_tokens,
  }
}

// ── Handler ───────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const missing = missingEnv([
    'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ANTHROPIC_API_KEY',
    'FB_PAGE_ID', 'FB_PAGE_TOKEN', 'GITHUB_TOKEN', 'GITHUB_REPO',
  ])
  if (missing.length) {
    return res.status(500).json({ error: `Server misconfigured: ${missing.join(', ')} must be set` })
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!isCron(req) && !(await adminUserId(req))) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // The published feed lives in git, so read it from GitHub (not the
    // deployed bundle) to get the latest entry date and the slugs in use.
    const [newsYaml, areasYaml] = await Promise.all([readRepoFile(NEWS_PATH), readRepoFile(AREAS_PATH)])
    const news = yaml.load(newsYaml) as { id: string; date: string }[]
    const areas = yaml.load(areasYaml) as { slug: string; name: string }[]
    const latest = news.reduce((max, p) => (p.date > max ? p.date : max), '2026-01-01')
    // Inclusive of the latest day so a same-day post isn't skipped; anything
    // already queued is filtered by external_id below.
    const posts = await fetchPagePosts(Math.floor(Date.parse(`${latest}T00:00:00Z`) / 1000))

    const { data: known } = await supabase
      .from('social_posts')
      .select('external_id, draft')
      .eq('platform', 'facebook')
    const knownIds = new Set((known ?? []).map((r) => r.external_id as string))
    const takenSlugs = new Set([
      ...news.map((p) => p.id),
      ...(known ?? []).map((r) => (r.draft as Draft | null)?.slug).filter((s): s is string => !!s),
    ])

    // Text posts only (skips cover-photo changes and bare shares), oldest first.
    const fresh = posts
      .filter((p) => p.message?.trim() && !knownIds.has(p.id))
      .sort((a, b) => a.created_time.localeCompare(b.created_time))
    const batch = fresh.slice(0, MAX_PER_RUN)

    // A few recent entries show Claude the house format.
    const examples = newsYaml.split(/\n(?=- id:)/).slice(0, 3).join('\n')

    let tokens = 0
    const errors: string[] = []
    for (const post of batch) {
      const images = await storeImages(post.id, imageUrls(post))
      let draft: Draft | null = null
      let draftError: string | null = null
      try {
        const result = await draftEntry(post, images, areas, examples, takenSlugs)
        draft = result.draft
        tokens += result.tokens
      } catch (err) {
        // Still queue the post — the reviewer can write the entry by hand.
        draftError = err instanceof Error ? err.message : String(err)
        errors.push(`${post.id}: ${draftError}`)
      }
      const { error } = await supabase.from('social_posts').insert({
        platform: 'facebook',
        external_id: post.id,
        permalink: post.permalink_url ?? null,
        posted_at: post.created_time,
        message: post.message,
        images: images.map(({ path, url }) => ({ path, url })),
        draft,
        draft_error: draftError,
      })
      if (error) errors.push(`${post.id}: insert failed: ${error.message}`)
    }

    return res.status(200).json({
      fetched: posts.length,
      queued: batch.length,
      remaining: fresh.length - batch.length,
      tokens,
      errors,
    })
  } catch (err) {
    console.error('[social/sync]', err)
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Sync failed' })
  }
}
