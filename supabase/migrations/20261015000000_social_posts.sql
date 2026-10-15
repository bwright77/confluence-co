-- Facebook → "The current" review queue.
--
-- api/social/sync pulls new Page posts, copies their images into the
-- social-post-images bucket (Facebook CDN URLs expire), drafts a news entry
-- with Claude, and inserts a 'pending' row here. An admin reviews it at
-- /admin/news; api/social/publish commits the entry to src/content/news.yaml
-- on GitHub (git stays the source of truth for the public site).

create table social_posts (
  id           uuid primary key default gen_random_uuid(),
  platform     text not null default 'facebook',
  external_id  text not null,
  permalink    text,
  posted_at    timestamptz not null,
  message      text,
  -- [{ "path": "<storage path>", "url": "<public url>" }]
  images       jsonb not null default '[]'::jsonb,
  -- Claude's draft: { slug, title, body, imageAlts[], tags[] }
  draft        jsonb,
  draft_error  text,
  status       text not null default 'pending'
               check (status in ('pending', 'published', 'dismissed')),
  news_id      text,
  commit_sha   text,
  reviewed_by  uuid references profiles(id),
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (platform, external_id)
);

create index social_posts_status_posted_at on social_posts (status, posted_at desc);

alter table social_posts enable row level security;

-- Inserts come from the service role (sync job). Admins review and dismiss
-- from the browser; publishing goes through the service-role API.
create policy "Admins can read social posts"
  on social_posts for select to authenticated
  using ((select role from profiles where id = auth.uid()) = 'admin');
create policy "Admins can update social posts"
  on social_posts for update to authenticated
  using ((select role from profiles where id = auth.uid()) = 'admin');

-- Public bucket: these are already-public Facebook photos, and the admin
-- preview needs plain <img> URLs. Writes are service-role only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'social-post-images', 'social-post-images', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
