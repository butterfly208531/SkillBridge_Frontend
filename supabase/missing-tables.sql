-- All missing tables: site_settings, community_stats + finance tables.
-- Idempotent (safe to run repeatedly). Run this once in the Supabase SQL Editor.

-- ── site_settings (key/value JSON; used by Settings + admin credentials) ─────
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── community_stats (admin community section overrides) ─────────────────────
create table if not exists community_stats (
  key          text primary key,
  stats_value  text not null default '',
  stats_suffix text not null default '',
  url          text not null default '',
  label        text not null default '',
  stat_label   text not null default ''
);

-- ── Finance tables (same as finance-schema.sql, kept idempotent) ────────────
create table if not exists course_category (
  id            uuid primary key default gen_random_uuid(),
  category_name text not null default '',
  created_at    timestamptz not null default now()
);

create table if not exists course_table (
  id          uuid primary key default gen_random_uuid(),
  course_code text unique,
  course_name text not null default '',
  category_id uuid references course_category(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists course_base_fee (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid references course_table(id) on delete cascade,
  course_code   text,
  base_fee      numeric(12,2) not null default 0,
  discount      numeric(12,2) not null default 0,
  status        text not null default 'active',
  created_at    timestamptz not null default now()
);

create table if not exists course_batch (
  id                uuid primary key default gen_random_uuid(),
  batch_code        text,
  batch_name        text,
  course_code       text,
  start_date        date,
  end_date          date,
  registration_date date,
  installment       boolean not null default false,
  max_installment   integer not null default 1,
  installment_amount numeric(12,2) not null default 0,
  batch_status      text not null default 'active',
  created_at        timestamptz not null default now()
);

create table if not exists applicant_table (
  id          text primary key,
  batch_id    uuid references course_batch(id) on delete set null,
  course_id   text,
  full_name   text not null default '',
  phone       text,
  total_paid  numeric(12,2) not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists payment_information (
  id                         uuid primary key default gen_random_uuid(),
  payment_id                 text unique,
  applicant_id               text references applicant_table(id) on delete cascade,
  month_payment_happen       date,
  paid_installment           integer not null default 1,
  current_month              integer not null default 1,
  current_month_installment  numeric(12,2) not null default 0,
  total_paid                 numeric(12,2) not null default 0,
  installment_status         text not null default 'pending',
  remaining_balance          numeric(12,2) not null default 0,
  payment_completion_percent numeric(5,2) not null default 0,
  created_at                 timestamptz not null default now()
);

create table if not exists expense_tracker (
  id                    uuid primary key default gen_random_uuid(),
  expense_tracker_code  text,
  expense_date          date,
  expense_month         text,
  course_id             text,
  expense_for           text,
  expense_description   text,
  amount                numeric(12,2) not null default 0,
  payment_method        text,
  reference_image       text,
  approved_by           text,
  created_at            timestamptz not null default now()
);

create table if not exists bootcamp_revenue (
  id                    uuid primary key default gen_random_uuid(),
  course_id             text,
  course_name           text not null default '',
  total_student_enrolled integer not null default 0,
  collected_revenue     numeric(12,2) not null default 0,
  current_balance       numeric(12,2) not null default 0,
  bootcamp_status       text not null default 'active',
  completed_student     integer not null default 0,
  active_student        integer not null default 0,
  created_at            timestamptz not null default now()
);

-- ── RLS: allow anon (same "anon all" model as the rest of the app) ──────────
alter table site_settings     enable row level security;
alter table community_stats   enable row level security;

do $$
declare t text;
begin
  foreach t in array array['site_settings','community_stats','course_category','course_table','course_base_fee','course_batch','applicant_table','payment_information','expense_tracker','bootcamp_revenue']
  loop
    execute format('drop policy if exists "allow anon all on %I" on %I', t, t);
    execute format('create policy "allow anon all on %I" on %I for all to anon using (true) with check (true)', t, t);
  end loop;
end $$;

-- ── Seed default admin credentials so the login reads from the DB ───────────
insert into site_settings (key, value)
values ('admin_credentials', '{"email":"admin@skillbridge.com","password":"Admin123!"}'::jsonb)
on conflict (key) do nothing;