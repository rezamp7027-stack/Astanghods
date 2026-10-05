-- Reproducible volunteer/service network schema
create table if not exists public.volunteer_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 skills text[] not null default '{}', interests text[] not null default '{}',
 availability jsonb not null default '{}', city text,
 province_id uuid references public.provinces(id) on delete set null,
 bio text, is_active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.volunteer_opportunities (
 id uuid primary key default gen_random_uuid(),title text not null,slug text not null unique,
 summary text,description text,skills text[] not null default '{}',
 province_id uuid references public.provinces(id) on delete set null,city text,
 starts_at timestamptz,ends_at timestamptz,capacity integer check(capacity is null or capacity>0),
 status text not null default 'draft' check(status in('draft','published','closed','completed')),
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 check(ends_at is null or starts_at is null or ends_at>=starts_at)
);
create table if not exists public.volunteer_assignments (
 id uuid primary key default gen_random_uuid(),opportunity_id uuid not null references public.volunteer_opportunities(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'applied' check(status in('applied','selected','confirmed','cancelled','completed')),
 applied_at timestamptz not null default now(),confirmed_at timestamptz,completed_at timestamptz,notes text,
 unique(opportunity_id,user_id)
);
create index if not exists volunteer_profiles_province_idx on public.volunteer_profiles(province_id,is_active);
create index if not exists volunteer_opportunities_status_idx on public.volunteer_opportunities(status,starts_at);
create index if not exists volunteer_opportunities_province_idx on public.volunteer_opportunities(province_id,status);
create index if not exists volunteer_assignments_user_idx on public.volunteer_assignments(user_id,status,applied_at desc);
create index if not exists volunteer_assignments_opportunity_idx on public.volunteer_assignments(opportunity_id,status);
alter table public.volunteer_profiles enable row level security;alter table public.volunteer_opportunities enable row level security;alter table public.volunteer_assignments enable row level security;
grant select,insert,update,delete on public.volunteer_profiles to authenticated;grant select,insert,update,delete on public.volunteer_opportunities to authenticated;grant select,insert,update,delete on public.volunteer_assignments to authenticated;
drop policy if exists volunteer_profiles_self on public.volunteer_profiles;create policy volunteer_profiles_self on public.volunteer_profiles for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
drop policy if exists volunteer_profiles_staff on public.volunteer_profiles;create policy volunteer_profiles_staff on public.volunteer_profiles for select to authenticated using(public.has_any_role(array['super_admin','crm_manager','regional_manager','auditor']::public.app_role[]));
drop policy if exists volunteer_opportunities_public_read on public.volunteer_opportunities;create policy volunteer_opportunities_public_read on public.volunteer_opportunities for select to anon,authenticated using(status='published');
drop policy if exists volunteer_opportunities_staff on public.volunteer_opportunities;create policy volunteer_opportunities_staff on public.volunteer_opportunities for all to authenticated using(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[]));
drop policy if exists volunteer_assignments_self_read on public.volunteer_assignments;create policy volunteer_assignments_self_read on public.volunteer_assignments for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists volunteer_assignments_staff_read on public.volunteer_assignments;create policy volunteer_assignments_staff_read on public.volunteer_assignments for select to authenticated using(public.has_any_role(array['super_admin','regional_manager','crm_manager','auditor']::public.app_role[]));
drop policy if exists volunteer_assignments_staff_update on public.volunteer_assignments;create policy volunteer_assignments_staff_update on public.volunteer_assignments for update to authenticated using(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[]));
create or replace function private.apply_volunteer_opportunity(p_opportunity_id uuid) returns public.volunteer_assignments language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user uuid:=auth.uid();v_assignment public.volunteer_assignments%rowtype;v_capacity integer;v_count integer;
begin
 if v_user is null then raise exception 'authentication_required';end if;
 if not exists(select 1 from public.volunteer_profiles where user_id=v_user and is_active=true) then raise exception 'volunteer_profile_required';end if;
 select capacity into v_capacity from public.volunteer_opportunities where id=p_opportunity_id and status='published' for update;if not found then raise exception 'opportunity_not_available';end if;
 if exists(select 1 from public.volunteer_assignments where opportunity_id=p_opportunity_id and user_id=v_user and status in('applied','selected','confirmed')) then raise exception 'already_applied';end if;
 select count(*)::integer into v_count from public.volunteer_assignments where opportunity_id=p_opportunity_id and status in('selected','confirmed');if v_capacity is not null and v_count>=v_capacity then raise exception 'opportunity_full';end if;
 insert into public.volunteer_assignments(opportunity_id,user_id,status) values(p_opportunity_id,v_user,'applied') returning * into v_assignment;
 insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id) values(v_user,'volunteer_applied','volunteer','volunteer_opportunity',p_opportunity_id);
 return v_assignment;
end;$$;
revoke all on function private.apply_volunteer_opportunity(uuid) from public,anon,authenticated;
drop function if exists public.apply_volunteer_opportunity(uuid);create or replace function public.apply_volunteer_opportunity(p_opportunity_id uuid) returns public.volunteer_assignments language sql security invoker set search_path=public,pg_temp as $$ select private.apply_volunteer_opportunity(p_opportunity_id); $$;
revoke all on function public.apply_volunteer_opportunity(uuid) from public,anon;grant execute on function public.apply_volunteer_opportunity(uuid) to authenticated;