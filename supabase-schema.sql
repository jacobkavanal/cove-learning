-- ============================================
-- Cove Learning — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================

-- 1. Tutors (extends Supabase auth.users)
create table public.tutors (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name  text not null,
  email      text not null unique,
  phone      text,
  university text,
  status     text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

-- 2. Customers (parents / guardians)
create table public.customers (
  id           uuid primary key default gen_random_uuid(),
  first_name   text not null,
  last_name    text not null,
  email        text not null unique,
  phone        text,
  zip_code     text,
  relationship text default 'parent',
  created_at   timestamptz not null default now()
);

-- 3. Students
create table public.students (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  first_name  text not null,
  last_name   text not null,
  grade_level text,
  subjects    text[],
  notes       text,
  created_at  timestamptz not null default now()
);

-- 4. Tutor ↔ Student assignments
create table public.tutor_students (
  tutor_id   uuid not null references public.tutors(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  rate      numeric(6,2) not null check (rate > 0),
  primary key (tutor_id, student_id)
);

-- 5. Sessions (hour logs)
create table public.sessions (
  id             uuid primary key default gen_random_uuid(),
  tutor_id       uuid not null references public.tutors(id) on delete cascade,
  student_id     uuid not null references public.students(id) on delete cascade,
  session_date   date not null,
  duration_hours numeric(4,2) not null check (duration_hours > 0),
  subject        text not null,
  notes          text,
  created_at     timestamptz not null default now()
);

-- ============================================
-- Row-Level Security
-- ============================================

alter table public.tutors        enable row level security;
alter table public.customers     enable row level security;
alter table public.students      enable row level security;
alter table public.tutor_students enable row level security;
alter table public.sessions      enable row level security;

-- Tutors can read/update their own row
create policy "Tutors: read own"   on public.tutors for select using (auth.uid() = id);
create policy "Tutors: update own" on public.tutors for update using (auth.uid() = id);

-- Tutors can see their assigned students
create policy "Students: tutor can read assigned" on public.students
  for select using (
    id in (select student_id from public.tutor_students where tutor_id = auth.uid())
  );

-- Tutors can see the parent info for their assigned students
create policy "Customers: tutor can read" on public.customers
  for select using (
    id in (
      select s.customer_id from public.students s
      join public.tutor_students ts on ts.student_id = s.id
      where ts.tutor_id = auth.uid()
    )
  );

-- Tutor-student assignments: tutors see their own
create policy "Tutor-students: read own" on public.tutor_students
  for select using (tutor_id = auth.uid());

-- Sessions: tutors can read, create, update their own
create policy "Sessions: tutor read own"   on public.sessions for select using (tutor_id = auth.uid());
create policy "Sessions: tutor insert own" on public.sessions for insert with check (tutor_id = auth.uid());
create policy "Sessions: tutor update own" on public.sessions for update using (tutor_id = auth.uid());

-- ============================================
-- Public lead tables (no anon insert — use Edge Function)
-- ============================================

-- Tutor interest form submissions (pre-auth)
create table public.tutor_applications (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  school        text not null,
  graduating_year text not null,
  created_at    timestamptz not null default now()
);

alter table public.tutor_applications enable row level security;
-- No policies: anon cannot read/insert. Edge Function uses service role to insert.

-- Parent interest form submissions (pre-auth)
create table public.parent_applications (
  id           uuid primary key default gen_random_uuid(),
  first_name   text not null,
  last_name    text not null,
  email        text not null unique,
  phone        text,
  zip_code     text,
  num_students text,
  relationship text default 'parent',
  created_at   timestamptz not null default now()
);

alter table public.parent_applications enable row level security;
-- No policies: anon cannot read/insert. Edge Function uses service role to insert.
