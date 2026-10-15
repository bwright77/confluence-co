import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import yaml from 'js-yaml'
import {
  supabase, IMAGE_BUCKET, NEWS_PATH, AREAS_PATH, GH_BRANCH,
  missingEnv, adminUserId, gh, readRepoFile,
} from './_shared'

// Publishes a reviewed social post to "The current": one commit on main that
// prepends the entry to src/content/news.yaml and adds its image under
// public/news/. Vercel deploys the commit like any other push.
//
//   POST Authorization: Bearer <admin JWT>   body: PublishInput

export const config = { maxDuration: 60 }

const PublishInput = z.object({
  id: z.uuid(),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase words joined by hyphens'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().trim().min(1),
  // Trailing spaces would be stripped by the YAML block anyway; drop them up
  // front so the round-trip check below compares like with like.
  body: z.string().trim().min(1).transform((s) => s.split('\n').map((l) => l.trimEnd()).join('\n')),
  imageIndex: z.number().int().min(0).nullable(),
  imageAlt: z.string().trim(),
  imageFit: z.enum(['cover', 'contain']),
  tags: z.array(z.string()).max(3),
}).refine((v) => v.imageIndex === null || v.imageAlt.length > 0, {
  message: 'Alt text is required when an image is attached',
  path: ['imageAlt'],
})
type Entry = z.infer<typeof PublishInput>

// JSON strings are valid YAML double-quoted scalars, so this quotes safely.
const q = (s: string) => JSON.stringify(s)

function entryYaml(e: Entry, imagePath: string | null, permalink: string | null): string {
  const lines = [
    `- id: ${e.slug}`,
    `  date: ${q(e.date)}`,
    `  title: ${q(e.title)}`,
    '  body: |',
    ...e.body.split('\n').map((l) => (l.trim() ? `    ${l.trimEnd()}` : '')),
  ]
  if (imagePath) {
    lines.push(`  image: ${imagePath}`, `  imageAlt: ${q(e.imageAlt)}`)
    if (e.imageFit === 'contain') lines.push('  imageFit: contain')
  }
  if (permalink) {
    lines.push('  link:', '    label: View on Facebook', `    href: ${q(permalink)}`)
  }
  if (e.tags.length) lines.push('  tags:', ...e.tags.map((t) => `    - ${t}`))
  return lines.join('\n')
}

interface GhRef { object: { sha: string } }
interface GhCommit { sha: string; tree: { sha: string } }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const missing = missingEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'GITHUB_TOKEN', 'GITHUB_REPO'])
  if (missing.length) {
    return res.status(500).json({ error: `Server misconfigured: ${missing.join(', ')} must be set` })
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const userId = await adminUserId(req)
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const parsed = PublishInput.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join('; ') })
  }
  const entry = parsed.data

  const { data: row } = await supabase
    .from('social_posts')
    .select('id, external_id, permalink, images, status')
    .eq('id', entry.id)
    .maybeSingle()
  if (!row) return res.status(404).json({ error: 'Post not found' })
  if (row.status !== 'pending') return res.status(409).json({ error: `Post is already ${row.status}` })

  try {
    const areas = yaml.load(await readRepoFile(AREAS_PATH)) as { slug: string }[]
    const validTags = new Set(areas.map((a) => a.slug))
    const badTags = entry.tags.filter((t) => !validTags.has(t))
    if (badTags.length) return res.status(400).json({ error: `Unknown tags: ${badTags.join(', ')}` })

    // Image → git blob (done once; the commit below may retry).
    const files: { path: string; sha: string }[] = []
    let imagePath: string | null = null
    if (entry.imageIndex !== null) {
      const image = (row.images as { path: string }[])[entry.imageIndex]
      if (!image) return res.status(400).json({ error: 'Selected image not found' })
      const { data: blob, error } = await supabase.storage.from(IMAGE_BUCKET).download(image.path)
      if (error || !blob) throw new Error(`Image download failed: ${error?.message}`)
      const ext = image.path.split('.').pop()
      imagePath = `/news/${entry.slug}.${ext}`
      const { sha } = await gh<{ sha: string }>('/git/blobs', {
        method: 'POST',
        body: JSON.stringify({
          content: Buffer.from(await blob.arrayBuffer()).toString('base64'),
          encoding: 'base64',
        }),
      })
      files.push({ path: `public${imagePath}`, sha })
    }
    const newEntry = entryYaml(entry, imagePath, row.permalink)

    // Read-modify-commit against the branch head; retry once if someone else
    // pushed in between (the ref update is a non-forced fast-forward).
    let commitSha = ''
    for (let attempt = 0; ; attempt++) {
      const ref = await gh<GhRef>(`/git/ref/heads/${GH_BRANCH}`)
      const head = await gh<GhCommit>(`/git/commits/${ref.object.sha}`)
      const current = await readRepoFile(NEWS_PATH, head.sha)

      const posts = yaml.load(current) as { id: string }[]
      if (posts.some((p) => p.id === entry.slug)) {
        return res.status(409).json({ error: `A news entry with id "${entry.slug}" already exists` })
      }
      // Newest first, matching how the file is maintained by hand.
      const at = current.search(/^- id:/m)
      const next = at < 0
        ? `${newEntry}\n`
        : `${current.slice(0, at)}${newEntry}\n\n${current.slice(at)}`

      // Guard against a formatting slip reaching the build.
      const check = (yaml.load(next) as { id: string; title: string; body: string }[])
        .find((p) => p.id === entry.slug)
      if (!check || check.title !== entry.title || check.body.trim() !== entry.body) {
        throw new Error('Generated YAML did not round-trip')
      }

      const { sha: newsSha } = await gh<{ sha: string }>('/git/blobs', {
        method: 'POST',
        body: JSON.stringify({ content: next, encoding: 'utf-8' }),
      })
      const tree = await gh<{ sha: string }>('/git/trees', {
        method: 'POST',
        body: JSON.stringify({
          base_tree: head.tree.sha,
          tree: [...files, { path: NEWS_PATH, sha: newsSha }]
            .map(({ path, sha }) => ({ path, sha, mode: '100644', type: 'blob' })),
        }),
      })
      const commit = await gh<{ sha: string }>('/git/commits', {
        method: 'POST',
        body: JSON.stringify({
          message: `content(news): ${entry.title}\n\nPublished from /admin/news (Facebook post ${row.external_id}).`,
          tree: tree.sha,
          parents: [head.sha],
        }),
      })
      try {
        await gh(`/git/refs/heads/${GH_BRANCH}`, {
          method: 'PATCH',
          body: JSON.stringify({ sha: commit.sha, force: false }),
        })
        commitSha = commit.sha
        break
      } catch (err) {
        if ((err as { status?: number }).status !== 422 || attempt >= 1) throw err
      }
    }

    await supabase.from('social_posts').update({
      status: 'published',
      news_id: entry.slug,
      commit_sha: commitSha,
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', entry.id)

    return res.status(200).json({ commit_sha: commitSha, news_id: entry.slug })
  } catch (err) {
    console.error('[social/publish]', err)
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Publish failed' })
  }
}
