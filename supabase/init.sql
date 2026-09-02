-- ============================================================================
-- SkillBridge Frontend — Supabase migration/initialization script
-- ----------------------------------------------------------------------------
-- Run this ONCE in the Supabase Dashboard → SQL Editor.
--
-- It:
--   1. Creates the missing tables (categories, job_applications).
--   2. Adds missing columns to existing tables (applications, jobs).
--   3. Ensures all tables have anon RLS policies so the frontend
--      (which uses ONLY the anon/publishable key — no auth) can read/write.
--   4. Creates the `receipts` storage bucket + policies (course fee receipts).
--   5. Seeds initial categories.
--
-- All statements are idempotent (IF NOT EXISTS / IF NOT EXISTS guards), so it
-- is safe to run more than once.
-- ============================================================================

-- ============================================================================
-- 1. CREATE MISSING TABLES
-- ============================================================================

-- categories (used by courses; delete-all + upsert from admin)
create table if not exists public.categories (
  id          text primary key,
  name        text not null,
  color       text,
  description text,
  created_at  timestamptz default now()
);

-- job_applications (stored whenever a job application is submitted)
create table if not exists public.job_applications (
  id              text primary key,
  full_name       text,
  email           text,
  phone           text,
  telegram_handle text,
  address         text,
  gender          text,
  nationality     text,
  university      text,
  date_of_birth   text,
  job_id          text,
  job_title       text,
  company         text,
  cover_letter    text,
  marketing_source text,
  submitted_at    timestamptz,
  status          text default 'new',
  read            boolean default false
);
create index if not exists job_applications_submitted_at_idx on public.job_applications (submitted_at desc);

-- ============================================================================
-- 2. ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================================

-- applications
alter table public.applications add column if not exists course_type     text default '';
alter table public.applications add column if not exists university      text default '';
alter table public.applications add column if not exists date_of_birth   text default '';
alter table public.applications add column if not exists payment_method  text default '';
alter table public.applications add column if not exists receipt_url     text default '';
alter table public.applications add column if not exists telegram_handle text default '';
alter table public.applications add column if not exists gender          text default '';
alter table public.applications add column if not exists nationality     text default '';

-- jobs
alter table public.jobs add column if not exists application_mode text default 'both';
alter table public.jobs add column if not exists logo            text default '';

-- community_stats (key-based PK; ensure expected columns exist)
alter table public.community_stats add column if not exists key          text;
alter table public.community_stats add column if not exists stats_value  text;
alter table public.community_stats add column if not exists stats_suffix text;
alter table public.community_stats add column if not exists url          text;
alter table public.community_stats add column if not exists label        text;
alter table public.community_stats add column if not exists stat_label   text;

-- site_settings (key-based PK; ensure expected columns exist)
alter table public.site_settings add column if not exists key   text;
alter table public.site_settings add column if not exists value jsonb default '{}'::jsonb;

-- ============================================================================
-- 3. ROW LEVEL SECURITY — anon policies
-- ----------------------------------------------------------------------------
-- The frontend uses ONLY the anon/publishable key (no Supabase auth), so all
-- tables the app reads/writes must allow "anon all". Existing tables already
-- worked with anon, so we only create policies idempotently; policies are
-- keyed by a fixed name so re-runs don't create duplicates.
-- ============================================================================

-- applications
alter table public.applications enable row level security;
drop policy if exists applications_anon_all on public.applications;
create policy applications_anon_all on public.applications
  for all to anon using (true) with check (true);

-- categories
alter table public.categories enable row level security;
drop policy if exists categories_anon_all on public.categories;
create policy categories_anon_all on public.categories
  for all to anon using (true) with check (true);

-- community_stats
alter table public.community_stats enable row level security;
drop policy if exists community_stats_anon_all on public.community_stats;
create policy community_stats_anon_all on public.community_stats
  for all to anon using (true) with check (true);

-- contact_messages
alter table public.contact_messages enable row level security;
drop policy if exists contact_messages_anon_all on public.contact_messages;
create policy contact_messages_anon_all on public.contact_messages
  for all to anon using (true) with check (true);

-- courses
alter table public.courses enable row level security;
drop policy if exists courses_anon_all on public.courses;
create policy courses_anon_all on public.courses
  for all to anon using (true) with check (true);

-- job_applications
alter table public.job_applications enable row level security;
drop policy if exists job_applications_anon_all on public.job_applications;
create policy job_applications_anon_all on public.job_applications
  for all to anon using (true) with check (true);

-- jobs
alter table public.jobs enable row level security;
drop policy if exists jobs_anon_all on public.jobs;
create policy jobs_anon_all on public.jobs
  for all to anon using (true) with check (true);

-- page_views
alter table public.page_views enable row level security;
drop policy if exists page_views_anon_all on public.page_views;
create policy page_views_anon_all on public.page_views
  for all to anon using (true) with check (true);

-- projects
alter table public.projects enable row level security;
drop policy if exists projects_anon_all on public.projects;
create policy projects_anon_all on public.projects
  for all to anon using (true) with check (true);

-- scholarships
alter table public.scholarships enable row level security;
drop policy if exists scholarships_anon_all on public.scholarships;
create policy scholarships_anon_all on public.scholarships
  for all to anon using (true) with check (true);

-- scholarship_winners
alter table public.scholarship_winners enable row level security;
drop policy if exists scholarship_winners_anon_all on public.scholarship_winners;
create policy scholarship_winners_anon_all on public.scholarship_winners
  for all to anon using (true) with check (true);

-- site_settings
alter table public.site_settings enable row level security;
drop policy if exists site_settings_anon_all on public.site_settings;
create policy site_settings_anon_all on public.site_settings
  for all to anon using (true) with check (true);

-- ============================================================================
-- 4. STORAGE — reimbursement/receipts bucket
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

drop policy if exists receipts_anon_select on storage.objects;
create policy receipts_anon_select on storage.objects
  for select to anon using (bucket_id = 'receipts');

drop policy if exists receipts_anon_insert on storage.objects;
create policy receipts_anon_insert on storage.objects
  for insert to anon with check (bucket_id = 'receipts');

-- ============================================================================
-- 5. SEED — initial categories
-- ============================================================================
insert into public.categories (id, name, color, description) values
  ('Development', 'Development', 'amber',   ''),
  ('AI',          'AI',          'purple',  ''),
  ('ERP',         'ERP',         'blue',    ''),
  ('IT',          'IT',          'cyan',    ''),
  ('Business',    'Business',    'emerald', ''),
  ('Language',    'Language',    'pink',    ''),
  ('Automation',  'Automation',  'teal',    '')
on conflict (id) do nothing;

-- ============================================================================
-- DONE
-- ============================================================================
