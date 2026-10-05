-- Reproducible event registration and capacity migration
create table if not exists public.event_registrations (id uuid primary key default gen_random_uuid(),event_id uuid not null references public.events(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,status text not null default 'confirmed' check(status in('pending','confirmed','waitlisted','cancelled')),registered_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(event_id,user_id));
create index if not exists event_registrations_event_status_idx on public.event_registrations(event_id,status);
create index if not exists event_registrations_user_idx on public.event_registrations(user_id,registered_at desc);
alter table public.event_registrations enable row level security;
grant select,insert,update,delete on public.event_registrations to authenticated;
drop policy if exists event_registrations_self_read on public.event_registrations;
create policy event_registrations_self_read on public.event_registrations for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists event_registrations_self_cancel on public.event_registrations;
create policy event_registrations_self_cancel on public.event_registrations for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()) and status='cancelled');
drop policy if exists event_registrations_staff_read on public.event_registrations;
create policy event_registrations_staff_read on public.event_registrations for select to authenticated using(public.has_any_role(array['super_admin','program_manager','crm_manager','auditor']::public.app_role[]));
drop policy if exists event_registrations_staff_update on public.event_registrations;
create policy event_registrations_staff_update on public.event_registrations for update to authenticated using(public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[]));
create or replace function private.register_for_event(p_event_id uuid) returns public.event_registrations language plpgsql security definer set search_path=public,pg_temp as $$
declare v_user uuid:=auth.uid();v_capacity integer;v_count integer;v_row public.event_registrations%rowtype;
begin
 if v_user is null then raise exception 'authentication_required';end if;
 select capacity into v_capacity from public.events where id=p_event_id and is_public=true and starts_at>=now() for update;if not found then raise exception 'event_not_available';end if;
 if exists(select 1 from public.event_registrations where event_id=p_event_id and user_id=v_user and status in('pending','confirmed','waitlisted')) then raise exception 'already_registered';end if;
 select count(*)::integer into v_count from public.event_registrations where event_id=p_event_id and status='confirmed';
 if v_capacity is not null and v_count>=v_capacity then
  insert into public.event_registrations(event_id,user_id,status) values(p_event_id,v_user,'waitlisted') returning * into v_row;
 else
  insert into public.event_registrations(event_id,user_id,status) values(p_event_id,v_user,'confirmed') returning * into v_row;
 end if;
 insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id) values(v_user,'event_registered','event','event',p_event_id);
 return v_row;
end;$$;
revoke all on function private.register_for_event(uuid) from public,anon,authenticated;
drop function if exists public.register_for_event(uuid);
create or replace function public.register_for_event(p_event_id uuid) returns public.event_registrations language sql security invoker set search_path=public,pg_temp as $$ select * from private.register_for_event(p_event_id); $$;
revoke all on function public.register_for_event(uuid) from public,anon;
grant execute on function public.register_for_event(uuid) to authenticated;