-- ============================================================================
-- SkillBridge — PART 2 (missing pieces)
-- ----------------------------------------------------------------------------
-- The first run created the tables but did NOT add the missing columns or seed
-- the categories. Run THIS block in the Supabase SQL Editor (it is idempotent,
-- safe to re-run). It covers everything the first pass did not apply.
-- ============================================================================

-- 1. applications — add columns the code requires (idempotent)
alter table public.applications add column if not exists course_type     text default '';
alter table public.applications add column if not exists university      text default '';
alter table public.applications add column if not exists date_of_birth   text default '';
alter table public.applications add column if not exists payment_method  text default '';
alter table public.applications add column if not exists receipt_url     text default '';

-- 2. jobs — add columns the code requires (idempotent)
alter table public.jobs add column if not exists application_mode text default 'both';
alter table public.jobs add column if not exists logo            text default '';

-- 3. Community/settings tables — idempotent column safety
alter table public.community_stats add column if not exists key          text;
alter table public.community_stats add column if not exists stats_value  text;
alter table public.community_stats add column if not exists stats_suffix text;
alter table public.community_stats add column if not exists url          text;
alter table public.community_stats add column if not exists label        text;
alter table public.community_stats add column if not exists stat_label   text;

alter table public.site_settings add column if not exists key   text;
alter table public.site_settings add column if not exists value jsonb default '{}'::jsonb;

-- 4. Categories seed (only if empty)
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
