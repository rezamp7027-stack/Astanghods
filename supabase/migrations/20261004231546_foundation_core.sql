-- Astanghods Foundation Core Migration
-- Generated to keep the remote Supabase foundation reproducible.
create schema if not exists private;

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

create type public.app_role as enum (
  'super_admin','program_manager','content_manager','mentor_manager',
  'regional_manager','crm_manager','auditor'
);

create type public.program_status as enum (
  'draft','published','registration_closed','running','completed','archived'
);

create type public.registration_status as enum (
  'pending','confirmed','waitlisted','cancelled','rejected','completed'
);

create type public.content_status as enum (
  'draft','published','archived'
);

create type public.enrollment_status as enum (
  'active','completed','cancelled'
);

create table public.provinces (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  slug public.app_role not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  display_name text,
  phone text,
  birth_date date,
  province_id uuid references public.provinces(id) on delete set null,
  city text,
  avatar_path text,
  bio text,
  onboarding_completed boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users(id) on delete set null,
  primary key (user_id, role_id)
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  organization_type text not null,
  province_id uuid references public.provinces(id) on delete set null,
  city text,
  phone text,
  email text,
  website text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role_name text not null default 'member',
  joined_at timestamptz not null default now(),
  is_active boolean not null default true,
  primary key (organization_id, user_id)
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  status public.program_status not null default 'draft',
  program_type text not null default 'training',
  audience_min_age integer check (audience_min_age is null or audience_min_age >= 0),
  audience_max_age integer check (audience_max_age is null or audience_max_age >= audience_min_age),
  capacity integer check (capacity is null or capacity > 0),
  registration_open_at timestamptz,
  registration_close_at timestamptz,
  start_at timestamptz,
  end_at timestamptz,
  location_name text,
  province_id uuid references public.provinces(id) on delete set null,
  city text,
  cover_image_path text,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at is null or start_at is null or end_at >= start_at),
  check (registration_close_at is null or registration_open_at is null or registration_close_at >= registration_open_at)
);

create table public.program_tracks (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (program_id, slug)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue_name text,
  venue_address text,
  province_id uuid references public.provinces(id) on delete set null,
  city text,
  capacity integer check (capacity is null or capacity > 0),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create table public.event_sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location_name text,
  capacity integer check (capacity is null or capacity > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.registration_status not null default 'pending',
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  registered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, user_id)
);

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null unique references public.registrations(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  position integer not null check (position > 0),
  joined_at timestamptz not null default now(),
  promoted_at timestamptz,
  unique (program_id, user_id)
);

create table public.parent_links (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  youth_user_id uuid not null references auth.users(id) on delete cascade,
  relationship text,
  consented_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (parent_user_id, youth_user_id),
  check (parent_user_id <> youth_user_id)
);

create table public.mentor_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  expertise text[] not null default '{}',
  bio text,
  max_active_assignments integer not null default 10 check (max_active_assignments > 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mentor_assignments (
  id uuid primary key default gen_random_uuid(),
  mentor_user_id uuid not null references auth.users(id) on delete cascade,
  youth_user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid references public.programs(id) on delete set null,
  assigned_by uuid references auth.users(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  check (mentor_user_id <> youth_user_id)
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  slug text not null,
  lesson_type text not null default 'article',
  content jsonb not null default '{}'::jsonb,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (course_id, user_id)
);

create table public.lesson_progress (
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  progress_percent numeric(5,2) not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);

create table public.content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  body jsonb not null default '{}'::jsonb,
  content_type text not null default 'article',
  status public.content_status not null default 'draft',
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  notification_type text not null default 'system',
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  in_app boolean not null default true,
  sms boolean not null default false,
  email boolean not null default true,
  push boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_type text not null,
  version text not null,
  granted boolean not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create table public.engagement_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  occurred_at timestamptz not null default now(),
  source text,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb
);

create table public.audit_logs (
  id bigserial primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  request_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index programs_publication_idx on public.programs(status, published_at desc);
create index programs_registration_window_idx on public.programs(registration_open_at, registration_close_at);
create index programs_province_idx on public.programs(province_id);
create index events_start_idx on public.events(starts_at);
create index events_province_idx on public.events(province_id);
create index registrations_user_idx on public.registrations(user_id, registered_at desc);
create index registrations_program_status_idx on public.registrations(program_id, status);
create index waitlist_program_position_idx on public.waitlist_entries(program_id, position);
create index mentor_assignments_youth_idx on public.mentor_assignments(youth_user_id, ended_at);
create index mentor_assignments_mentor_idx on public.mentor_assignments(mentor_user_id, ended_at);
create index content_status_idx on public.content(status, published_at desc);
create index notifications_user_unread_idx on public.notifications(user_id, read_at, created_at desc);
create index engagement_user_time_idx on public.engagement_events(user_id, occurred_at desc);
create index audit_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger organizations_set_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger programs_set_updated_at before update on public.programs for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger registrations_set_updated_at before update on public.registrations for each row execute function public.set_updated_at();
create trigger mentor_profiles_set_updated_at before update on public.mentor_profiles for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses for each row execute function public.set_updated_at();
create trigger lessons_set_updated_at before update on public.lessons for each row execute function public.set_updated_at();
create trigger lesson_progress_set_updated_at before update on public.lesson_progress for each row execute function public.set_updated_at();
create trigger content_set_updated_at before update on public.content for each row execute function public.set_updated_at();
create trigger notification_preferences_set_updated_at before update on public.notification_preferences for each row execute function public.set_updated_at();

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = (select auth.uid()) and r.slug = required_role
  );
$$;

create or replace function public.has_any_role(required_roles public.app_role[])
returns boolean
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = (select auth.uid()) and r.slug = any(required_roles)
  );
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function private.register_for_program(p_program_id uuid)
returns table(registration_id uuid, registration_status public.registration_status, waitlist_position integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_program public.programs%rowtype;
  v_registration_id uuid;
  v_count integer;
  v_position integer;
begin
  if v_user_id is null then raise exception 'authentication_required'; end if;

  select * into v_program
  from public.programs
  where id = p_program_id and status = 'published'
  for update;

  if not found then raise exception 'program_not_available'; end if;
  if v_program.registration_open_at is not null and now() < v_program.registration_open_at then raise exception 'registration_not_open'; end if;
  if v_program.registration_close_at is not null and now() > v_program.registration_close_at then raise exception 'registration_closed'; end if;

  if exists (
    select 1 from public.registrations
    where program_id = p_program_id and user_id = v_user_id
      and status in ('pending','confirmed','waitlisted')
  ) then raise exception 'already_registered'; end if;

  select count(*)::integer into v_count
  from public.registrations
  where program_id = p_program_id and status in ('pending','confirmed');

  if v_program.capacity is not null and v_count >= v_program.capacity then
    insert into public.registrations (program_id,user_id,status)
    values (p_program_id,v_user_id,'waitlisted')
    returning id into v_registration_id;

    select coalesce(max(position),0)+1 into v_position
    from public.waitlist_entries where program_id = p_program_id;

    insert into public.waitlist_entries (registration_id,program_id,user_id,position)
    values (v_registration_id,p_program_id,v_user_id,v_position);

    return query select v_registration_id,'waitlisted'::public.registration_status,v_position;
    return;
  end if;

  insert into public.registrations (program_id,user_id,status)
  values (p_program_id,v_user_id,'confirmed')
  returning id into v_registration_id;

  return query select v_registration_id,'confirmed'::public.registration_status,null::integer;
end;
$$;

revoke all on function private.register_for_program(uuid) from public, anon;
grant execute on function private.register_for_program(uuid) to authenticated;

create or replace function public.register_for_program(p_program_id uuid)
returns table(registration_id uuid, registration_status public.registration_status, waitlist_position integer)
language sql
security invoker
set search_path = public, pg_temp
as $$ select * from private.register_for_program(p_program_id); $$;

revoke all on function public.register_for_program(uuid) from public, anon;
grant execute on function public.register_for_program(uuid) to authenticated;

insert into public.roles (slug,name,description) values
  ('super_admin','مدیر ارشد','دسترسی کامل مدیریتی'),
  ('program_manager','مدیر برنامه‌ها','مدیریت برنامه‌ها و ثبت‌نام‌ها'),
  ('content_manager','مدیر محتوا','مدیریت محتوای آموزشی و رسانه'),
  ('mentor_manager','مدیر مربیان','مدیریت مربیان و تخصیص‌ها'),
  ('regional_manager','مدیر شبکه استانی','مدیریت شبکه و استان‌ها'),
  ('crm_manager','مدیر ارتباط با مخاطب','مدیریت CRM و تعاملات'),
  ('auditor','بازرس','مشاهده گزارش‌ها و ممیزی')
on conflict (slug) do nothing;

insert into public.provinces (name,slug) values
  ('آذربایجان شرقی','east-azerbaijan'),('آذربایجان غربی','west-azerbaijan'),
  ('اردبیل','ardabil'),('اصفهان','isfahan'),('البرز','alborz'),('ایلام','ilam'),
  ('بوشهر','bushehr'),('تهران','tehran'),('چهارمحال و بختیاری','chaharmahal-and-bakhtiari'),
  ('خراسان جنوبی','south-khorasan'),('خراسان رضوی','razavi-khorasan'),('خراسان شمالی','north-khorasan'),
  ('خوزستان','khuzestan'),('زنجان','zanjan'),('سمنان','semnan'),
  ('سیستان و بلوچستان','sistan-and-baluchestan'),('فارس','fars'),('قزوین','qazvin'),
  ('قم','qom'),('کردستان','kurdistan'),('کرمان','kerman'),('کرمانشاه','kermanshah'),
  ('کهگیلویه و بویراحمد','kohgiluyeh-and-boyer-ahmad'),('گلستان','golestan'),('گیلان','gilan'),
  ('لرستان','lorestan'),('مازندران','mazandaran'),('مرکزی','markazi'),('هرمزگان','hormozgan'),
  ('همدان','hamedan'),('یزد','yazd')
on conflict (slug) do nothing;

alter table public.provinces enable row level security;
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.programs enable row level security;
alter table public.program_tracks enable row level security;
alter table public.events enable row level security;
alter table public.event_sessions enable row level security;
alter table public.registrations enable row level security;
alter table public.waitlist_entries enable row level security;
alter table public.parent_links enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.mentor_assignments enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.content enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.consent_records enable row level security;
alter table public.engagement_events enable row level security;
alter table public.audit_logs enable row level security;

create policy provinces_read on public.provinces for select to anon,authenticated using (true);
create policy roles_read on public.roles for select to authenticated using (true);
create policy profiles_select_self on public.profiles for select to authenticated using (id=(select auth.uid()));
create policy profiles_insert_self on public.profiles for insert to authenticated with check (id=(select auth.uid()));
create policy profiles_update_self on public.profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy user_roles_select_self on public.user_roles for select to authenticated using (user_id=(select auth.uid()));

create policy organizations_member_read on public.organizations for select to authenticated
using (
  public.has_any_role(array['super_admin','regional_manager']::public.app_role[])
  or exists (
    select 1 from public.organization_members om
    where om.organization_id=id and om.user_id=(select auth.uid()) and om.is_active=true
  )
);
create policy organizations_manage_staff on public.organizations for all to authenticated
using (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]));
create policy organization_members_self on public.organization_members for select to authenticated using (user_id=(select auth.uid()));
create policy organization_members_manage_staff on public.organization_members for all to authenticated
using (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]));

create policy programs_public_read on public.programs for select to anon,authenticated using (status='published');
create policy programs_manage_staff on public.programs for all to authenticated
using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));

create policy program_tracks_public_read on public.program_tracks for select to anon,authenticated
using (exists(select 1 from public.programs p where p.id=program_id and p.status='published'));
create policy program_tracks_manage_staff on public.program_tracks for all to authenticated
using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));

create policy events_public_read on public.events for select to anon,authenticated using (is_public=true);
create policy events_manage_staff on public.events for all to authenticated
using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy event_sessions_public_read on public.event_sessions for select to anon,authenticated
using (exists(select 1 from public.events e where e.id=event_id and e.is_public=true));
create policy event_sessions_manage_staff on public.event_sessions for all to authenticated
using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));

create policy registrations_select_self on public.registrations for select to authenticated using (user_id=(select auth.uid()));
create policy registrations_update_self_cancel on public.registrations for update to authenticated
using (user_id=(select auth.uid()) and status in ('pending','confirmed','waitlisted'))
with check (user_id=(select auth.uid()) and status='cancelled');
create policy registrations_staff_read on public.registrations for select to authenticated
using (public.has_any_role(array['super_admin','program_manager','crm_manager','auditor']::public.app_role[]));
create policy registrations_staff_update on public.registrations for update to authenticated
using (public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[]));

create policy waitlist_select_self on public.waitlist_entries for select to authenticated using (user_id=(select auth.uid()));
create policy parent_links_parent_read on public.parent_links for select to authenticated using (parent_user_id=(select auth.uid()));
create policy parent_links_youth_read on public.parent_links for select to authenticated using (youth_user_id=(select auth.uid()));

create policy mentor_profiles_public_read on public.mentor_profiles for select to authenticated using (is_available=true or user_id=(select auth.uid()));
create policy mentor_profiles_self_update on public.mentor_profiles for update to authenticated
using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy mentor_assignments_mentor_read on public.mentor_assignments for select to authenticated using (mentor_user_id=(select auth.uid()));
create policy mentor_assignments_youth_read on public.mentor_assignments for select to authenticated using (youth_user_id=(select auth.uid()));
create policy mentor_assignments_staff_manage on public.mentor_assignments for all to authenticated
using (public.has_any_role(array['super_admin','mentor_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','mentor_manager']::public.app_role[]));

create policy courses_public_read on public.courses for select to anon,authenticated using (is_published=true);
create policy courses_manage_staff on public.courses for all to authenticated
using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy modules_public_read on public.course_modules for select to anon,authenticated
using (exists(select 1 from public.courses c where c.id=course_id and c.is_published=true));
create policy modules_manage_staff on public.course_modules for all to authenticated
using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy lessons_public_read on public.lessons for select to anon,authenticated using (
  is_published=true and exists(
    select 1 from public.course_modules m
    join public.courses c on c.id=m.course_id
    where m.id=module_id and c.is_published=true
  )
);
create policy lessons_manage_staff on public.lessons for all to authenticated
using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy enrollments_select_self on public.enrollments for select to authenticated using (user_id=(select auth.uid()));
create policy enrollments_staff_manage on public.enrollments for all to authenticated
using (public.has_any_role(array['super_admin','content_manager','program_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','content_manager','program_manager']::public.app_role[]));
create policy lesson_progress_self on public.lesson_progress for all to authenticated
using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));

create policy content_public_read on public.content for select to anon,authenticated using (status='published');
create policy content_manage_staff on public.content for all to authenticated
using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]))
with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));

create policy notifications_self on public.notifications for select to authenticated using (user_id=(select auth.uid()));
create policy notifications_mark_read on public.notifications for update to authenticated
using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy notification_preferences_self on public.notification_preferences for all to authenticated
using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));

create policy consent_records_self on public.consent_records for select to authenticated using (user_id=(select auth.uid()));
create policy consent_records_insert_self on public.consent_records for insert to authenticated with check (user_id=(select auth.uid()));

create policy engagement_events_self_insert on public.engagement_events for insert to authenticated with check (user_id=(select auth.uid()));
create policy engagement_events_self_read on public.engagement_events for select to authenticated using (user_id=(select auth.uid()));
create policy audit_logs_staff_read on public.audit_logs for select to authenticated
using (public.has_any_role(array['super_admin','auditor']::public.app_role[]));

revoke execute on function public.set_updated_at() from public,anon,authenticated;
revoke execute on function public.has_role(public.app_role) from public,anon;
revoke execute on function public.has_any_role(public.app_role[]) from public,anon;
grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.has_any_role(public.app_role[]) to authenticated;
