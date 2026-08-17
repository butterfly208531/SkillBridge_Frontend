-- Run this in Supabase SQL Editor to create the page_views table.
-- Dashboard → SQL Editor → Paste → Run

create table if not exists page_views (
  id         uuid primary key default gen_random_uuid(),
  page       text not null,
  path       text not null default '',
  referrer   text not null default '',
  viewed_at  timestamptz not null default now()
);

-- Index for fast time-range queries
create index if not exists idx_page_views_viewed_at on page_views (viewed_at desc);
create index if not exists idx_page_views_page on page_views (page);

-- Allow anonymous inserts (tracking) and admin reads
alter table page_views enable row level security;

-- Anyone can insert (track a page view)
create policy "Allow anonymous inserts"
  on page_views for insert
  with check (true);

-- Anyone can read (admin dashboard needs it)
create policy "Allow anonymous reads"
  on page_views for select
  using (true);
