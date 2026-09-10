-- Finance tables for the Finance admin tab.
-- Mirror the ERP-style schema (course batches, installments, expenses, revenue).
-- RLS: "anon all" like the other app tables (public read/write via anon key).

-- 1) Course category
create table if not exists course_category (
  id            uuid primary key default gen_random_uuid(),
  category_name text not null default '',
  created_at    timestamptz not null default now()
);

-- 2) Course master
create table if not exists course_table (
  id          uuid primary key default gen_random_uuid(),
  course_code text unique,
  course_name text not null default '',
  category_id uuid references course_category(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- 3) Course base fee (official tuition)
create table if not exists course_base_fee (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid references course_table(id) on delete cascade,
  course_code   text,
  base_fee      numeric(12,2) not null default 0,
  discount      numeric(12,2) not null default 0,
  status        text not null default 'active',
  created_at    timestamptz not null default now()
);

-- 4) Course batch
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

-- 5) Applicant
create table if not exists applicant_table (
  id          text primary key,
  batch_id    uuid references course_batch(id) on delete set null,
  course_id   text,
  full_name   text not null default '',
  phone       text,
  total_paid  numeric(12,2) not null default 0,
  created_at  timestamptz not null default now()
);

-- 6) Payment information (installment ledger)
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

-- 7) Expense tracker
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

-- 8) Bootcamp revenue
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

-- RLS (mirror the existing "anon all" model)
alter table course_category      enable row level security;
alter table course_table         enable row level security;
alter table course_base_fee      enable row level security;
alter table course_batch         enable row level security;
alter table applicant_table      enable row level security;
alter table payment_information  enable row level security;
alter table expense_tracker      enable row level security;
alter table bootcamp_revenue     enable row level security;

do $$
declare t text;
begin
  foreach t in array array['course_category','course_table','course_base_fee','course_batch','applicant_table','payment_information','expense_tracker','bootcamp_revenue']
  loop
    execute format('drop policy if exists "allow anon all on %I" on %I', t, t);
    execute format('create policy "allow anon all on %I" on %I for all to anon using (true) with check (true)', t, t);
  end loop;
end $$;