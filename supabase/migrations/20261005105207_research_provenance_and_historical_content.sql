-- Keep researched/historical data separate from live product content.
alter table public.programs
  add column if not exists is_historical boolean not null default false,
  add column if not exists source_url text,
  add column if not exists source_type text,
  add column if not exists source_confidence text;

alter table public.courses
  add column if not exists is_historical boolean not null default false,
  add column if not exists source_url text,
  add column if not exists source_type text,
  add column if not exists source_confidence text;

alter table public.content
  add column if not exists is_historical boolean not null default false,
  add column if not exists source_url text,
  add column if not exists source_type text,
  add column if not exists source_confidence text,
  add column if not exists source_published_at date,
  add column if not exists tags text[] not null default '{}';

create table if not exists public.research_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null unique,
  source_type text not null,
  publication_date date,
  accessed_at timestamptz not null default now(),
  confidence text not null default 'medium' check (confidence in ('high','medium','low','unverified')),
  notes text,
  metadata jsonb not null default '{}',
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.research_sources enable row level security;
revoke all on public.research_sources from anon, authenticated;
grant select on public.research_sources to anon, authenticated;

drop policy if exists "public can read public research sources" on public.research_sources;
create policy "public can read public research sources"
  on public.research_sources
  for select to anon, authenticated
  using (is_public);

create index if not exists research_sources_type_idx on public.research_sources(source_type);
create index if not exists research_sources_confidence_idx on public.research_sources(confidence);

update public.programs
set is_historical = true
where status = 'completed'
  and is_historical = false;

update public.courses
set is_historical = true
where slug in (
  'course-bi-nihayat','course-sadid','course-borhan-maaref',
  'course-borhan-morabi','course-zedd','course-logic-intro',
  'course-philosophy-intro','course-tavakkol','course-allameh-tabatabaei'
);

revoke execute on function private.register_for_program(uuid) from public;
revoke execute on function private.cancel_my_program_registration(uuid) from public;
revoke execute on function private.register_for_event(uuid) from public;
revoke execute on function private.cancel_my_event_registration(uuid) from public;
revoke execute on function private.enroll_in_course(uuid) from public;
revoke execute on function private.update_lesson_progress(uuid,numeric) from public;
revoke execute on function private.admin_promote_event_waitlist(uuid) from public;
revoke execute on function private.admin_set_user_role(uuid,public.app_role,boolean) from public;
revoke execute on function private.award_points(integer,text,text,uuid) from public;
